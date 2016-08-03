#coding=utf-8
"""
系统路由设置
"""

from handlers.pkt import PktDailyHandler,ManageIncreaseHandler,PktTrendHandler
from handlers.content import ContentDailyHandler,ContentDataHandler,RespContentHandler,RespContentGeo


urls = [
    # (r'/',IndexHandler),
    (r'/pkt/daily-count', PktDailyHandler),  # 天为单位统计
    (r'/pkt/same-day',ManageIncreaseHandler),  # 根据日期选择数据
    (r'/pkt/trend-count',PktTrendHandler),      # 趋势统计

    # 内容
    (r'/content/daily',ContentDailyHandler),   # DNS请求包分析
    (r'/content/get-data',ContentDataHandler),
    (r'/content/resp',RespContentHandler),
    (r'/content/geo',RespContentGeo)

]
