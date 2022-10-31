import mongoengine as me
from mongoengine import CASCADE

PLUGINS_NAMES = {
    'DISCORD_JOIN_CHANNEL': {},
}

class DiscordIntegration(me.EmbeddedDocument):
    id = me.IntField(required=True)
    username = me.StringField(required=True)
    discriminator = me.StringField(required=True)
    verified = me.BooleanField(default=False)


class User(me.Document):
    address = me.StringField(required=True)
    email = me.StringField(required=True)
    data = me.DictField(default={}, null=False)
    uuid = me.StringField(required=True, unique=True)

    discord = me.EmbeddedDocumentField(DiscordIntegration, null=True)


class Integration(me.Document):
    user = me.ReferenceField('User', reverse_delete_rule=CASCADE)
    integration = me.StringField(required=True, choices=PLUGINS_NAMES.keys())
    campaign_id = me.StringField(required=True)
    cid = me.StringField(required=True)
    data = me.DictField(default={}, null=False)
    approved = me.BooleanField(default=False)
    redeem = me.BooleanField(default=False)
