SELECT
    relname AS table,
    n_live_tup AS row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;