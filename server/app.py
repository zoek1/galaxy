import os
import re
import uuid

from flask import Flask, redirect, url_for, request, session
from flask_discord import DiscordOAuth2Session, requires_authorization, Unauthorized, exceptions
from flask_mongoengine import MongoEngine
from mongoengine.queryset.visitor import Q

from flask_cors import CORS
from pytezos import pytezos

import toml
import requests

from models import User, Integration, DiscordIntegration

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "true"

app = Flask(__name__)
app.config.from_file("config.toml", load=toml.load)
app.config['MONGODB_SETTINGS'] = {
    "db": "loyal",
    "host": "db",
    "port": 27017,
    "alias": "default",
}
db = MongoEngine(app)
CORS(app)
pytezos = pytezos.using(key=app.config['ACCOUNT'])
discord = DiscordOAuth2Session(app)
campaign_contract = pytezos.using('ghostnet').contract(app.config['CONTRACT'])


@app.route("/login/")
def discord_login():
    session['address'] = request.args.get('address')

    return discord.create_session()


@app.route("/callback/")
def discord_callback():
    try:
        discord.callback()
        user = discord.fetch_user()

        address = session['address']
        email = user.email

        discord_integration = User.objects(discord__id=user.id).first()

        if discord_integration:
            return redirect(url_for(".discord_me"))

        discord_integration = DiscordIntegration(
            id=user.id,
            username=user.username,
            discriminator=user.discriminator,
            verified=user.verified
        )

        integration = User.objects(Q(address=address) | Q(email=email)).first()
        if not integration:
            integration = User(address=address, email=email, uuid=str(uuid.uuid4()))

        integration.discord = discord_integration

        integration.save()

        print(f'REGISTER: {integration.uuid}: {integration.discord.username}')
    except exceptions.AccessDenied:
        return redirect(url_for("discord_login"))

    return redirect(url_for(".discord_me"))


@app.route("/check_reward/<string:campaign_id>")
@requires_authorization
def check_reward(campaign_id):
    cid = 'QmUy2LJpBvmPTxo6tnxYUpkrgn6Mu5LnmRs8xpdWuL88Vb'
    user = discord.fetch_user()
    print(user)

    integration = Integration.objects(campaign_id=campaign_id).first()
    if integration:
        # Check if reward was approved
        if integration.approved:
            return {
              'status': 203,
              'msg': 'Reward is approved, ready to claim!'
            }, 203
        elif integration.redeem:
            return {
              'status': 203,
              'msg': 'Reward already claimed!'
            }, 203
    else:
        user_obj = User.objects(email=user.email).first()
        integration = Integration(
            user=user_obj,
            integration='DISCORD_JOIN_CHANNEL',
            campaign_id=campaign_id,
            cid=cid)

    # Check user already redeem reward
    gateway = 'https://gateway.pinata.cloud/ipfs/'
    response = requests.get(gateway + cid)
    campaign_data = response.json()
    discord_integration = campaign_data['integrations']['DISCORD_JOIN_CHANNEL']

    r = re.compile('https://discord.gg/(?P<code>.*)')
    invitation_code = r.match(discord_integration['invitation_link']).groupdict().get('code')

    invite_inspect_url = f'https://discord.com/api/invites/{invitation_code}'
    response = requests.get(invite_inspect_url)
    invite_data = response.json()

    guild_id = int(invite_data['guild']['id'])

    guilds = [guild.id for guild in user.fetch_guilds()]

    if guild_id in guilds:
        # if not approve reward
        integration.approved = True
        integration.save()
        # Update db
        return {
            'status': 200,
            'msg': 'User joined the server, approving rewards!'
        }

    integration.save()
    # user.add_to_guild(guild_id)
    return {
            'status': 404,
            'msg': 'User not in server'
        }, 404


@app.errorhandler(Unauthorized)
def redirect_unauthorized(e):
    return redirect(url_for("login"))


@app.route("/me/")
@requires_authorization
def discord_me():
    user = discord.fetch_user()
    print(user.to_json())

    return f"""
    <html>
        <head>
            <title>{user.name}</title>
        </head>
        <body>
            <img src='{user.avatar_url}' />
        </body>
    </html>"""


if __name__ == "__main__":
    app.run(debug=True)