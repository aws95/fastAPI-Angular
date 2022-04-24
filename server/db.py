import motor.motor_asyncio
from bson.objectid import ObjectId
from model import Article
from pymongo import DESCENDING, ASCENDING, TEXT

client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017/')
database = client.Articles
collection = database.articles


async def fetch_article(_id):
    document = await collection.find_one({"_id": ObjectId(_id)})
    return document


async def fetch_all_articles(order,
                             type,
                             search=""):
    aticles = []
    searchQuery = {"$text": {"$search": f"\"{search}\""}
                   } if search != "" else {}
    cursor = collection.find(
        searchQuery, sort=[(order, DESCENDING if type == "1" else ASCENDING)])
    async for document in cursor:
        aticles.append(Article(**document))
    return aticles


async def create_article(article):
    document = article
    result = await collection.insert_one(document)
    return document


async def vote(_id, attr):
    print(_id, attr)
    await collection.update_one({"_id": ObjectId(_id)}, {"$inc": {attr: 1}})
    document = await collection.find_one({"_id": ObjectId(_id)})
    return document


async def populate_db():
    await collection.drop()
    articles = [

        {
            "title": "Title 1",
            "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu enim at leo egestas commodo eu ut nulla. Maecenas nec tellus ultricies, pellentesque orci eu, vulputate nibh. Proin ante eros, hendrerit non magna sit amet, interdum viverra risus. Vivamus viverra vestibulum ipsum. Suspendisse egestas finibus tincidunt. Aliquam et tristique leo. Praesent vel pharetra nibh.",
            "author": "Author 1",
            "up_votes": 13,
            "down_votes": 16
        },
        {
            "title": "Title 2",
            "content": "Suspendisse sit amet tortor pharetra, pellentesque purus in, suscipit orci. Morbi vel tempor ligula. Sed varius odio velit, vel lobortis lectus fringilla quis. Maecenas finibus sed mi ac lobortis. Sed eget quam lorem. Vestibulum at ante eu elit imperdiet euismod. Sed dui ipsum, tincidunt non odio at, placerat vulputate odio. Donec tristique consequat metus id maximus.",
            "author": "Author 2",
            "up_votes": 50,
            "down_votes": 33
        },
        {
            "title": "Title 3",
            "content": "Quisque maximus arcu dui, non pulvinar orci faucibus eget. Fusce quam nisi, porttitor ac turpis eget, consequat ornare dolor. Quisque semper velit non quam sagittis auctor. Fusce congue elit quis fringilla scelerisque. In purus erat, pellentesque et purus id, consectetur maximus mi. Nulla facilisi. Donec facilisis, libero sit amet luctus mollis, mauris dui placerat sem, non porta lectus eros non est. Morbi sit amet mauris convallis, malesuada nisl id, consequat risus. Curabitur nec neque quis orci condimentum aliquet eu nec tellus. Quisque sit amet mauris facilisis, porta nisi id, tempor purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras id lorem erat. Pellentesque quis turpis nunc. Aliquam erat volutpat.",
            "author": "Author 3",
            "up_votes": 24,
            "down_votes": 45
        },
        {
            "title": "Title 4",
            "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu enim at leo egestas commodo eu ut nulla. Maecenas nec tellus ultricies, pellentesque orci eu, vulputate nibh. Proin ante eros, hendrerit non magna sit amet, interdum viverra risus. Vivamus viverra vestibulum ipsum. Suspendisse egestas finibus tincidunt. Aliquam et tristique leo. Praesent vel pharetra nibh.",
            "author": "Author 4",
            "up_votes": 22,
            "down_votes": 11
        },
        {
            "title": "Title 5",
            "content": "Suspendisse sit amet tortor pharetra, pellentesque purus in, suscipit orci. Morbi vel tempor ligula. Sed varius odio velit, vel lobortis lectus fringilla quis. Maecenas finibus sed mi ac lobortis. Sed eget quam lorem. Vestibulum at ante eu elit imperdiet euismod. Sed dui ipsum, tincidunt non odio at, placerat vulputate odio. Donec tristique consequat metus id maximus.",
            "author": "Author 5",
            "up_votes": 33,
            "down_votes": 6
        },
        {
            "title": "Title 6",
            "content": "Quisque maximus arcu dui, non pulvinar orci faucibus eget. Fusce quam nisi, porttitor ac turpis eget, consequat ornare dolor. Quisque semper velit non quam sagittis auctor. Fusce congue elit quis fringilla scelerisque. In purus erat, pellentesque et purus id, consectetur maximus mi. Nulla facilisi. Donec facilisis, libero sit amet luctus mollis, mauris dui placerat sem, non porta lectus eros non est. Morbi sit amet mauris convallis, malesuada nisl id, consequat risus. Curabitur nec neque quis orci condimentum aliquet eu nec tellus. Quisque sit amet mauris facilisis, porta nisi id, tempor purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras id lorem erat. Pellentesque quis turpis nunc. Aliquam erat volutpat.",
            "author": "Author 6",
            "up_votes": 1,
            "down_votes": 3
        }

    ]
    await collection.create_index([("content", TEXT),
                                  ("title", TEXT), ("author", TEXT)])
    await collection.insert_many(articles)
    return {"msg": "ok"}
