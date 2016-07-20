# encoding:utf-8
"""
数据库操作
"""

from pymongo import MongoClient
import pymongo
from datetime import datetime,timedelta,date
import tldextract
import json
import time
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





def get_domain_collection(domain=None):
    """
    获取域名在数据库中对应的collection
    :param domain: 域名
    :return
    db.collection
    """
    if domain is None:
        return
    collection_name = domain.replace('.','_')
    db = get_db()
    return db[collection_name]


def get_domain_info(domain=None,start_date=None,end_date=None):
    """
    获取指定域名和日期的探测数据，根据开始日期和结束日期，从数据库中获取当天数据
    :param domain: 域名
    :param start_date: 开始日期
    :param end_date: 结束日期
    :return:
    """
    # if start_date.date() == end_date.date():    # 获得域名的当天探测数据
    domain_collection = get_domain_collection(domain)
    # drawTable()
    return domain_collection.find({'visit_time':{'$lte':end_date,'$gte':start_date}})

def test():
    print "nihao"
    domain_collection = get_domain_collection('360.com')
    a = domain_collection.find({'pkt_count':120})
    domain_count = {}
    print "this is drawTable"
    for i in a:
        if i['visit_time'].strftime("%Y-%m-%d %H:%M:%S")=='2016-07-18 21:33:17':
            for j in  i['details']:
                if len(j['dns'])==1:
                    if domain_count.has_key(j['dns']['qry_name']):
                        domain_count[j['dns']['qry_name']]+=1
                    else:
                        domain_count[j['dns']['qry_name']]=1
                    # print j['dns']['qry_name']
            for i in domain_count:
                print i
            # print domain_count
    # print domain_collection

test()

def extract_pkt_count(domain_dns_pkt = None):
    """

    :return:
    """
    pkt_list = []
    if domain_dns_pkt is None:
        return
    for pkt in domain_dns_pkt:
        # print pkt['visit_time'].strftime("%Y-%m-%d %H:%M:%S")
        visit_time = pkt['visit_time'].strftime("%Y-%m-%d %H:%M:%S")
        pkt_list.append({'visit_time':visit_time, 'pkt_count':int(pkt['pkt_count'])})
    # print pkt_list
    return json.dumps(pkt_list)


def get_same_day_pkt_count(domain,start,end):

    start = datetime.strptime(start,'%Y-%m-%d')
    end = datetime.utcnow()+ timedelta(hours=8)
    # end = datetime.strptime(end,'%Y-%m-%d')
    pkt_list = []
    # print start
    # print end
    domain_dns_pkt = get_domain_info(domain,start,end)
    for pkt in domain_dns_pkt:
        tmp = {'visit_time':0, 'qry_pkt':0, 'resp_pkt':0}
        tmp['visit_time'] = pkt['visit_time'].strftime("%Y-%m-%d %H:%M:%S")

        for i in pkt['details']:
            if len(i['dns']) <= 1:
                tmp['qry_pkt'] += 1
            else:
                tmp['resp_pkt'] += 1
        pkt_list.append(tmp)

    return json.dumps(pkt_list)

# drawTable()