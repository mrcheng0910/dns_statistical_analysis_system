# encoding:utf-8
"""
数据库操作
"""

from pymongo import MongoClient
import pymongo
from datetime import datetime,timedelta,date
import tldextract
import json
# import time
# from bson import json_util #用来使json可转换datetime


def get_db():
    """
    获取数据库
    :return
    其他：可以完善
    """
    client = MongoClient()
    db = client.websites_dns
    return db


def extract_domain_of_url(url=None):
    """
    url中提取出domain
    :param url:网址
    :return
    正常：返回domain
    异常：返回None
    """
    if url is None:
        return
    no_fetch_extract = tldextract.TLDExtract(suffix_list_urls=None)
    url = no_fetch_extract(url)
    if url.domain == "" or url.suffix == "":
        return
    else:
        return url.domain + '.' + url.suffix


def get_domain_collection(domain=None):
    """
    获取域名在数据库中对应的collection
    :param domain: 域名
    :return
    db.collection
    """
    if domain is None:
        return
    collection_name = domain.replace('.', '_')
    db = get_db()
    return db[collection_name]


def get_domain_info(domain=None, start_date=None, end_date=None):
    """
    获取指定域名和日期的探测数据，根据开始日期和结束日期，从数据库中获取当天数据
    :param domain: 域名
    :param start_date: 开始日期
    :param end_date: 结束日期
    :return:
    """
    # if start_date.date() == end_date.date():    # 获得域名的当天探测数据
    domain_collection = get_domain_collection(domain)
    return domain_collection.find({'visit_time': {'$lte': end_date,'$gte': start_date}}).sort('visit_time', pymongo.ASCENDING)


# def extract_pkt_count(domain_dns_pkt = None):
#     """
#
#     :return:
#     """
#     pkt_list = []
#     if domain_dns_pkt is None:
#         return
#     for pkt in domain_dns_pkt:
#         # print pkt['visit_time'].strftime("%Y-%m-%d %H:%M:%S")
#         visit_time = pkt['visit_time'].strftime("%Y-%m-%d %H:%M:%S")
#         pkt_list.append({'visit_time':visit_time, 'pkt_count':int(pkt['pkt_count'])})
#     # print pkt_list
#     return json.dumps(pkt_list)


def get_same_day_pkt_count(domain, start, end):

    start = datetime.strptime(start, '%Y-%m-%d')
    # end = datetime.utcnow()+ timedelta(hours=8)  # 当前时间，timedelta是为了成为北京时间
    end = datetime.strptime(end, '%Y-%m-%d') + timedelta(hours=24)
    pkt_list = []
    domain_dns_pkt = get_domain_info(domain, start, end)
    for pkt in domain_dns_pkt:
        tmp = {'visit_time': pkt['visit_time'].strftime("%Y-%m-%d %H:%M:%S"), 'qry_pkt': 0, 'resp_pkt': 0}
        print pkt['visit_time']
        for i in pkt['details']:
            if len(i['dns']) <= 1:
                tmp['qry_pkt'] += 1
            else:
                tmp['resp_pkt'] += 1
        pkt_list.append(tmp)

    return json.dumps(pkt_list)

# test()