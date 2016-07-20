#encoding:utf-8

from models.domain_collection import get_domain_collection
import pymongo
from datetime import datetime,timedelta,date
import json

# domain = 'baidu.com'
# start_date='2016-7-19'
# end_date = '2016-7-20'


def get_dm_content(domain,start_date,end_date):

    content = []
    domain_collection = get_domain_collection(domain)
    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    # end = datetime.utcnow()+ timedelta(hours=8)  # 当前时间，timedelta是为了成为北京时间
    end_date = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(hours=24)

    domain_pkts = domain_collection.find({'visit_time': {'$lte': end_date,'$gte': start_date}})
    for pkt in domain_pkts:
        domains = {}
        tmp = {'visit_time': "", 'pkt_count':0,'qry_pkt':0, 'resp_pkt':0,'domain_count':0,'domains':domains}
        # visit_time
        visit_time = pkt['visit_time'].strftime("%Y-%m-%d %H:%M:%S")
        tmp['visit_time']=visit_time
        tmp['pkt_count']=pkt['pkt_count']
        for i in pkt['details']:
            if len(i['dns']) <= 1:
                tmp['qry_pkt'] += 1
                if domains.has_key(i['dns']['qry_name']):
                    domains[i['dns']['qry_name']] += 1
                else:
                    domains[i['dns']['qry_name']] = 1
            else:
                tmp['resp_pkt'] += 1
        tmp['domains'] = domains
        tmp['domain_count'] = len(domains)
        content.append(tmp)
    return json.dumps(content)

# get_dm_content(domain,start_date,end_date)