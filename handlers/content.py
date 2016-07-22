# encoding:utf-8
import tornado.web
from models.content import get_dm_content,get_time_content

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
        domain = self.get_argument('domain',"None")
        visit_time = self.get_argument('visit_time','None')
        print domain
        print visit_time
        content_data = get_time_content(domain,visit_time)
        self.render(
            PATH+'resp_content.html',
            content_data=content_data
            )