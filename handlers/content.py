# encoding:utf-8
import tornado.web
from models.content import get_dm_content

PATH = './content/'


class ContentDailyHandler(tornado.web.RequestHandler):

    def get(self):

        self.render(PATH + 'daily.html')


class ContentDataHandler(tornado.web.RequestHandler):

    def get(self):
        domain = self.get_argument('domain',"None")
        start = self.get_argument('start', "None")
        end = self.get_argument('end', "None")

        content_data = get_dm_content(domain, start, end)
        self.write(content_data)


class RespContentHandler(tornado.web.RequestHandler):
    def get(self):
        # self.render(PATH+'resp_content.html')
        self.render(PATH+'test.html')