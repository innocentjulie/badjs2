#!/bin/bash


# read nginx access log file

logs_path="/app/log/access/"
logs_path_log="/app/log/logaccess/"

logs_file=${logs_path}access_$(date -d "yesterday" +"%Y%m%d").log

logs_file_log=${logs_path_log}access_$(date -d "yesterday" +"%Y%m%d").log

/app/node-v4.8.7-linux-x64/bin/node /app/badjs-ivweb/badjs-web/service/handle_pv.js ${logs_file} $(date -d "yesterday" +"%Y%m%d")
/app/node-v4.8.7-linux-x64/bin/node /app/badjs-ivweb/badjs-web/service/handle_pv_log.js ${logs_file_log} $(date -d "yesterday" +"%Y%m%d")
