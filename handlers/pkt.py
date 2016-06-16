# encoding:utf-8
import tornado.web
from models.pkt import get_same_day_pkt_count


PATH = './pkt/'

class PktHandler(tornado.web.RequestHandler):

    def get(self):


        # tlds = TldDb().get_tlds()
        # self.render('tld.html',
        #             tlds_num=len(tlds),
        #             tlds=tlds,
        #             )
        self.render(PATH + 'pkt_same_day.html',
                    # results=results
                    )
        # self.write("hello")


class ManageIncreaseHandler(tornado.web.RequestHandler):

    def get(self):
        domain = self.get_argument('domain',"None")
        start = self.get_argument('start', "None")
        end = self.get_argument('end', "None")
        detect =get_same_day_pkt_count(domain,start,end)
        # detect = test()
        # print detect
        self.write(detect)