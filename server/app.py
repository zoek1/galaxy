import os
import re
import uuid

from flask import Flask, redirect, url_for, request, session
from flask_discord import DiscordOAuth2Session, requires_authorization, Unauthorized, exceptions
from flask_dance.contrib.twitter import make_twitter_blueprint, twitter
from flask_mongoengine import MongoEngine
from mongoengine.queryset.visitor import Q

from flask_cors import CORS
from pytezos import pytezos

import toml
import requests

from models import User, Integration, DiscordIntegration, TwitterIntegration, TEXT_PLUGIN_NAMES

# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "true"

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
twitter_bp = make_twitter_blueprint()
app.register_blueprint(twitter_bp, url_prefix='/t', redirect_to='check_twitter_reward')


app.config.update(dict(
  PREFERRED_URL_SCHEME = 'https'
))

def get_campaign(campaign_id):
    campaign_contract = pytezos.using('ghostnet').contract(app.config['CONTRACT'])
    campaign_storage = campaign_contract.storage['campaigns']
    return campaign_storage[campaign_id]()


def approve_campaign_integration(address, campaign_id, integration_id):
    campaign_contract = pytezos.using('ghostnet').contract(app.config['CONTRACT'])
    return campaign_contract.approveRedeem(campaign=campaign_id,
                                           earned=0,
                                           integration=integration_id,
                                           proof="",
                                           spender=address).send()


@app.route("/check_question_reward/<string:campaign_id>/<string:integration_type>")
def check_question_reward(campaign_id, integration_type):
    try:
        campaign_tz = get_campaign(campaign_id)
    except:
        return {
            'status': 404,
            'msg': 'Campaign Doesn\'t exists'
        }, 404

    cid = campaign_tz['metadata_url'].split('ipfs://')[1]
    print(campaign_tz)
    if integration_type not in TEXT_PLUGIN_NAMES.keys() or integration_type not in campaign_tz['integrations'].keys():
        return {
                   'status': 400,
                   'msg': 'This method only support question and selection integrations'
               }, 400

    if request.args.get('address'):
        session['address'] = request.args.get('address')
        address = request.args.get('address')
    else:
        address = session['address']

    user = User.objects(address=address).first()
    if not user:
        user = User(address=address, uuid=str(uuid.uuid4()), email="")
        user.save()

    integration = Integration.objects(user=user, campaign_id=campaign_id, integration=integration_type).first()
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
        integration = Integration(
            uuid=str(uuid.uuid4()),
            user=user,
            integration=integration_type,
            campaign_id=campaign_id,
            cid=cid)

    response = request.args.get('response', '')
    if response.strip() == '':
        return {
           'status': 400,
           'msg': 'No response provided'
        }, 400

    integration.data = {
        'response': response
    }
    approve_campaign_integration(user.address, campaign_id, integration_type)
    integration.approved = True

    integration.save()
    # Update db
    return {
        'status': 200,
        'msg': 'User asked the question, approving rewards!'
    }


@app.route("/check_twitter_reward/<string:campaign_id>/<string:integration_type>")
def check_twitter_reward(campaign_id, integration_type):
    try:
        campaign_tz = get_campaign(campaign_id)
    except:
        return {
                   'status': 404,
                   'msg': 'Campaign Doesn\'t exists'
               }, 404

    cid = campaign_tz['metadata_url'].split('ipfs://')[1]

    print(url_for('twitter.authorized', _external=True))
    if request.args.get('address'):
        session['address'] = request.args.get('address')
        address = request.args.get('address')
    else:
        address = session['address']

    user = User.objects(address=address).first()
    if not user:
        user = User(address=address, uuid=str(uuid.uuid4()))

    if not twitter.authorized:
        return redirect(url_for("twitter.login"))

    if not user.twitter:
        resp = twitter.get("account/verify_credentials.json?include_email=true&skip_status=true")
        assert resp.ok
        data = resp.json()
        twitter_data = {
            'id': data['id'],
            'screen_name': data['screen_name'],
            'name': data['name'],
            'suspended': data['suspended'],
            'email': data['email'],
        }

        if not user.email:
            user.email = data['email']

        user.twitter = TwitterIntegration(**twitter_data)
        user.save()

    integration = Integration.objects(user=user, campaign_id=campaign_id, integration=integration_type).first()
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
        integration = Integration(
            uuid=str(uuid.uuid4()),
            user=user,
            integration=integration_type,
            campaign_id=campaign_id,
            cid=cid)

    # Check user already redeem reward
    gateway = 'https://gateway.pinata.cloud/ipfs/'
    response = requests.get(gateway + cid)
    campaign_data = response.json()
    twitter_integration = campaign_data['integrations'][integration_type]

    resp = twitter.get(f"users/show.json?screen_name={twitter_integration['screen_name'].replace('@', '')}")
    assert resp.ok
    follow = resp.json()

    resp = twitter.get(f"followers/ids.json?screen_name={twitter_integration['screen_name'].replace('@', '')}&stringify_ids=true&count=5000")
    assert resp.ok
    followers = resp.json()

    if str(user.twitter.id) in followers['ids']:
        # if not approve reward
        approve_campaign_integration(user.address, campaign_id, integration_type)
        integration.approved = True

        integration.save()
        # Update db
        return {
            'status': 200,
            'msg': 'User followed the account, approving rewards!'
        }

    integration.save()

    return {
        'status': 404,
        'msg': 'User not followed account',
    }, 404


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
            verified=user.verified,
            email=email
        )

        user_obj = User.objects(Q(address=address) | Q(email=email)).first()
        if not user_obj:
            user_obj = User(address=address, email=email, uuid=str(uuid.uuid4()))

        user_obj.discord = discord_integration

        user_obj.save()

        print(f'REGISTER: {user_obj.uuid}: {user_obj.discord.username}')
    except exceptions.AccessDenied:
        return redirect(url_for("discord_login"))

    return redirect(url_for(".discord_me"))


@app.route("/check_discord_reward/<string:campaign_id>/<string:integration_type>")
@requires_authorization
def check_discord_reward(campaign_id, integration_type):
    try:
        campaign_tz = get_campaign(campaign_id)
    except:
        return {
                   'status': 404,
                   'msg': 'Campaign Doesn\'t exists'
               }, 404

    cid = campaign_tz['metadata_url'].split('ipfs://')[1]
    user = discord.fetch_user()

    # integration_type = requests.args.get('integration', 'DISCORD_JOIN_CHANNEL')
    user_obj = User.objects(email=user.email).first()
    integration = Integration.objects(user=user_obj, campaign_id=campaign_id, integration=integration_type).first()
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
        integration = Integration(
            uuid=str(uuid.uuid4()),
            user=user_obj,
            integration=integration_type,
            campaign_id=campaign_id,
            cid=cid)

    # Check user already redeem reward
    gateway = 'https://gateway.pinata.cloud/ipfs/'
    response = requests.get(gateway + cid)
    campaign_data = response.json()
    discord_integration = campaign_data['integrations'][integration_type]

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
    return redirect(url_for("discord_login"))


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

# https://0d5e-2806-2f0-7020-73fb-7167-ab75-d2da-f9b2.ngrok.io/check_discord_reward/TEST_CAMPAIGN_1/DISCORD_JOIN_CHANNEL?address=tz1NGXTDR4cQHh5wQaW5vnv6V93fnaegPuEX
class ReverseProxied(object):
    """
    Because we are reverse proxied from an aws load balancer
    use environ/config to signal https
    since flask ignores preferred_url_scheme in url_for calls
    """

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        # if one of x_forwarded or preferred_url is https, prefer it.
        forwarded_scheme = environ.get("HTTP_X_FORWARDED_PROTO", None)
        preferred_scheme = app.config.get("PREFERRED_URL_SCHEME", None)
        if "https" in [forwarded_scheme, preferred_scheme]:
            environ["wsgi.url_scheme"] = "https"
        return self.app(environ, start_response)


app.wsgi_app = ReverseProxied(app.wsgi_app)

if __name__ == "__main__":
    app.run(debug=True)