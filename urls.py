#coding=utf-8
"""
系统路由设置
"""
# from handlers.index import IndexHandler
from handlers.pkt import PktHandler,ManageIncreaseHandler
urls = [
    # (r'/',IndexHandler),
    (r'/',PktHandler), # 测试使用
    # (r'/pkt/detail',PktHandler)
    (r'/pkt/same-day',ManageIncreaseHandler)
]
# from handlers.index import IndexHandler
# from handlers.domain import DomainIndexHandler,DomainTldNumHandler,DomainTldIndexHandler
# from handlers.svr import *
# from handlers.tld import TldHandler
# from handlers.system_performance.whois_integrity import DomainWhoisHandler,ShowAssignmentTld,ShowAssignmentType
# from handlers.system_performance.detect_efficiency import DetectHandler,ManageIncreaseHandler
# from handlers.system_performance.detect_forcast import DetectForcastHandler,ForcastPeriodHandler
# from handlers.system_performance.detect_count import DomainCountHandler,GetDomainCountHandler
#
# from handlers.table_overall import TbOverallHandler,TbDataHistoryHandler,TbIncreaseHandler,TbIncreaseDetailHander
#
# urls = [
#     #  首页内容
#     (r'/', IndexHandler),   # 首页
#
#     (r'/tld', TldHandler),
#
#     (r'/domain/overall', DomainIndexHandler),  # 域名首页
#     (r'/domain/tld-number',DomainTldIndexHandler),
#     (r'/domain/tld-query',DomainTldNumHandler),  # 制定后缀域名数量
#
#
#     (r'/svr', DomainSvrHandler),  # 域名whois服务器首页
#     (r'/svr_geo',SvrGeoHandler),   # 域名whois服务器地理位置
#     (r'/svr_geo_table',SvrGeoTableHandler), # 详细信息
#     (r'/svr_performance',SvrPerformanceHandler), # whois服务器性能
#     (r'/svr_table',SvrTableHandler), # 服务器表格内容测试，测试
#     (r'/svr_table_info',SvrInfoHandler),  # 信息
#
#     (r'/top_sec',TopSecSvr),  # 一级和二级服务器
#     # (r'/top_sec/query',TopSecQuery),  # 获取信息
#     (r'/top_sec/query_num',TopSecNum),  # 获取对比数据
#
#     (r'/whois_integrity',DomainWhoisHandler), # whois信息完整性分析
#     (r'/whois_integrity/assignment_tld',ShowAssignmentTld),  # 查询指定后缀的flag分布
#     (r'/whois_integrity/assignment_type',ShowAssignmentType), # 查询指定类型的whois分布
#     (r'/detect',DetectHandler),  # 探测效率
#     (r'/detect/increase',ManageIncreaseHandler),  # 探测性能
#     (r'/forcast',DetectForcastHandler), # 预测
#     (r'/forcast/period',ForcastPeriodHandler),  # 预测
#     (r'/detect_count',DomainCountHandler),  # 探测信息
#     (r'/detect_count/data',GetDomainCountHandler),
#
#     # 数据库表情况
#     (r'/table/overall', TbOverallHandler),  # 数据库表整体情况
#     (r'/table/overall/history', TbDataHistoryHandler),  # 历史情况
#     (r'/table/increase', TbIncreaseHandler),  # 表增长情况
#     (r'/table/increase/detail',TbIncreaseDetailHander),  # 增长详细情况
# ]
