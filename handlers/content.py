# encoding:utf-8

import tornado.web
from models.content import get_dm_content,get_time_content,get_domain_geo,get_details_data

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
            'domain_name': 'baidu.com',
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

class RespContentGeoData(tornado.web.RequestHandler):
    def get(self):
        domain_name = self.get_argument('domain', "None")
        detected_geo = self.get_argument('detected',"None")
        detected_network = self.get_argument('detected_network',"None")
        dns_geo = self.get_argument('dns_geo',"None")
        dns_network = self.get_argument('dns_network', "None")
        dns = self.get_argument('dns',"None")

        domain_info ={
            'domain_name': domain_name.strip(),
            'detected_geo': detected_geo.strip(),
            'detected_network': detected_network.strip(),
            'dns_geo': dns_geo.strip(),
            "dns_network": dns_network.strip(),
            "dns": dns.strip()
        }
        # print domain_info
        result = get_domain_geo(domain_info)
        # print result
        self.write(result)

class RespContentDetail(tornado.web.RequestHandler):
    def get(self):
        self.render(PATH+'detail.html')


class ContentContentData(tornado.web.RequestHandler):
    def get(self):
        domain_name = self.get_argument('domain', "None")
        detected_geo = self.get_argument('detected', "None")
        detected_network = self.get_argument('detected_network', "None")
        dns_geo = self.get_argument('dns_geo', "None")
        dns_network = self.get_argument('dns_network', "None")
        dns = self.get_argument('dns', "None")

        domain_info = {
            'domain_name': domain_name.strip(),
            'detected_geo': detected_geo.strip(),
            'detected_network': detected_network.strip(),
            'dns_geo': dns_geo.strip(),
            "dns_network": dns_network.strip(),
            "dns": dns.strip()
        }
        result = get_details_data(domain_info)
        self.write(result)

class DeleteData(tornado.web.RequestHandler):
    def get(self):
        self.write("True")