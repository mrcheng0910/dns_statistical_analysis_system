#encoding:utf-8

from models.domain_collection import get_domain_collection
import pymongo
from datetime import datetime,timedelta,date
import json
import collections

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
        visit_time = pkt['visit_time'].strftime("%Y-%m-%d %H:%M:%S")
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
        print tmp
        content.append(tmp)
    return json.dumps(content)

# get_dm_content(domain,start_date,end_date)