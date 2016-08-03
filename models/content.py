#encoding:utf-8

from models.domain_collection import get_domain_collection
import pymongo
from datetime import datetime,timedelta,date
import json
import collections
from collections import Counter


def get_dm_content(domain,start_date,end_date):

    content = []
    domain_collection = get_domain_collection(domain)
    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    # end = datetime.utcnow()+ timedelta(hours=8)  # 当前时间，timedelta是为了成为北京时间
    end_date = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(hours=24)

    domain_pkts = domain_collection.find({'visit_time': {'$lte': end_date,'$gte': start_date}})
    for pkt in domain_pkts:
        qry_domains = {}
        resp_domains = {}
        tmp = dict(visit_time="", pkt_count=0, qry_pkt=0, resp_pkt=0, qry_domain_count=0, resp_domain_count=0,
                   qry_domains=qry_domains, resp_domains=resp_domains)
        visit_time = pkt['visit_time'].strftime("%Y-%m-%d %H:%M:%S.%f")
        tmp['visit_time'] = visit_time
        tmp['pkt_count'] = pkt['pkt_count']
        for i in pkt['details']:
            if len(i['dns']) <= 1:
                tmp['qry_pkt'] += 1
                if qry_domains.has_key(i['dns']['qry_name']):
                    qry_domains[i['dns']['qry_name']] += 1
                else:
                    qry_domains[i['dns']['qry_name']] = 1
            else:
                tmp['resp_pkt'] += 1
                if resp_domains.has_key(i['dns']['qry_name']):
                    resp_domains[i['dns']['qry_name']] += 1
                else:
                    resp_domains[i['dns']['qry_name']] = 1

        tmp['qry_domains'] = collections.OrderedDict(sorted(qry_domains.items()))
        tmp['resp_domains'] = collections.OrderedDict(sorted(resp_domains.items()))
        tmp['qry_domain_count'] = len(qry_domains)
        tmp['resp_domain_count'] = len(resp_domains)
        content.append(tmp)
    return json.dumps(content)


def get_time_content(domain=None,visit_time=None):
    """
    根据域名和访问时间，得到访问内容
    :param domain:
    :param visit_time:
    :return:
    """
    # domain='baidu.com'
    # visit_time = '2016-07-21 15:16:51.847000'
    visit_time = datetime.strptime(visit_time, "%Y-%m-%d %H:%M:%S.%f")
    domain_collection = get_domain_collection(domain)

    domain_pkts = domain_collection.find({'visit_time': visit_time})
    nodes = set()  # 防止出现重复数据
    edges = set()
    for pkt in domain_pkts[0]['details']:
        if len(pkt['dns'])>1:
            # print pkt['dns']['details']
            # print pkt['dns']['qry_name']
            for i in pkt['dns']['details']:
                nodes.add(i['domain_name'])
                nodes.add(i['dm_data'])
                edges.add((i['domain_name'],i['dm_data']))

    return json.dumps((list(nodes),list(edges)))


def get_domain_geo(domain_info={}):
    """
    获取域名地图展示数据
    :param domain:
    :return:
    """
    # 查询条件
    domain_name = domain_info['domain_name']
    detected_geo = domain_info['detected_geo']
    detected_network = domain_info['detected_network']
    dns_geo = domain_info['dns_geo']
    dns_network = domain_info['dns_network']
    dns = domain_info['dns']

    domain_collection = get_domain_collection('data_info')
    domain_pkts = domain_collection.find({'domain_name': domain_name,
                                          'detected_geo': detected_geo,
                                          'detected_network_operator': detected_network,
                                          'dns_geo': dns_geo,
                                          'dns_network_operator': dns_network,
                                          'dns': dns
                                          }).limit(1)

    geo_data = []
    city_value = Counter()
    network_distribution = Counter()
    city = []
    network = []
    result = []
    for i in domain_pkts[0]['details']:
        for v in i['answers']:
            # print v
            if v['dm_type'] == 'A':
                city_value[v['geo']] += 1
                network_distribution[v['network_operator']] += 1
    # print city_value
    # print network_distribution

    for i in city_value:
        geo_data.append([{'name':detected_geo},{'name':i,'value':city_value[i]}])
        city.append([i,city_value[i]])
    for i in network_distribution:
        network.append([i,network_distribution[i]])
    # print geo_data
    # print city
    # print network
    return json.dumps([geo_data, city, network])
    # return geo_data


# get_domain_geo(domain_info)