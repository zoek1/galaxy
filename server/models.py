import mongoengine as me
from mongoengine import CASCADE

PLUGINS_NAMES = {
    'DISCORD_JOIN_CHANNEL': {},
    'TWITTER_FOLLOW': {}
}

class DiscordIntegration(me.EmbeddedDocument):
    id = me.IntField(required=True)
    username = me.StringField(required=True)
    discriminator = me.StringField(required=True)
    verified = me.BooleanField(default=False)
    email = me.StringField(required=True)


class TwitterIntegration(me.EmbeddedDocument):
    id = me.IntField(required=True)
    name = me.StringField(required=True)
    screen_name = me.StringField(required=True)
    suspended = me.BooleanField(default=False)
    email = me.StringField(required=True)


class User(me.Document):
    address = me.StringField(required=True, unique=True)
    email = me.StringField(required=True)
    data = me.DictField(default={}, null=False)
    uuid = me.StringField(required=True, unique=True, primary_key=False)

    discord = me.EmbeddedDocumentField(DiscordIntegration, null=True)
    twitter = me.EmbeddedDocumentField(TwitterIntegration, null=True)


class Integration(me.Document):
    uuid = me.StringField(required=True, unique=True)
    user = me.ReferenceField('User', reverse_delete_rule=CASCADE)
    integration = me.StringField(required=True, choices=PLUGINS_NAMES.keys())
    campaign_id = me.StringField(required=True)
    cid = me.StringField(required=True)
    data = me.DictField(default={}, null=False)
    approved = me.BooleanField(default=False)
    redeem = me.BooleanField(default=False)
