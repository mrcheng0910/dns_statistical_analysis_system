# encoding:utf-8
import tornado.web
from models.pkt import get_same_day_pkt_count


PATH = './pkt/'


class PktDailyHandler(tornado.web.RequestHandler):

    def get(self):

        self.render(PATH + 'daily_count.html')


class ManageIncreaseHandler(tornado.web.RequestHandler):

    def get(self):
        domain = self.get_argument('domain',"None")
        start = self.get_argument('start', "None")
        end = self.get_argument('end', "None")
        detect = get_same_day_pkt_count(domain, start, end)
        # detect = test()
        # print detect
        self.write(detect)


class PktTrendHandler(tornado.web.RequestHandler):

    def get(self):
        self.render(PATH + 'trend_count.html')