import mongoengine as me
from mongoengine import CASCADE

TEXT_PLUGIN_NAMES = {
    'ASK_QUESTION_1': {},
    'ASK_QUESTION_2': {},
    'ASK_QUESTION_3': {},
    'ASK_QUESTION_4': {},
    'ASK_QUESTION_5': {},
    'CHOOSE_OPTION_1': {},
    'CHOOSE_OPTION_2': {},
    'CHOOSE_OPTION_3': {},
    'CHOOSE_OPTION_4': {},
    'CHOOSE_OPTION_5': {},
}

PLUGINS_NAMES = {
    'DISCORD_JOIN_CHANNEL': {},
    'TWITTER_FOLLOW': {},
    **TEXT_PLUGIN_NAMES
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


class Campaign(me.Document):
    campaign_id = me.StringField(required=True, unique=True)
    owner = me.StringField(required=True)