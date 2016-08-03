# encoding:utf-8

import tornado.web
from models.content import get_dm_content,get_time_content,get_domain_geo

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
        content_data = get_time_content(domain,visit_time)
        self.render(
            PATH+'resp_content.html',
            content_data=content_data
            )


class RespContentGeo(tornado.web.RequestHandler):
    def get(self):
        domain_info ={
            'domain_name': 'hitwh.edu.cn',
            'detected_geo': '威海',
            'detected_network': '联通',
            'dns_geo': "杭州",
            "dns_network": "阿里云",
            "dns": "223.5.5.5"
        }
        result = get_domain_geo(domain_info)
        self.render(PATH+'content_geo.html',
                    result = result
                    )
