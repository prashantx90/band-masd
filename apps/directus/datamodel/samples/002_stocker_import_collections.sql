INSERT INTO public.directus_collections (
    collection,
    icon,
    note,
    display_template,
    hidden,
    singleton,
    translations,
    archive_field,
    archive_app_filter,
    archive_value,
    unarchive_value,
    sort_field,
    accountability,
    color,
    item_duplication_fields,
    sort,
    "group",
    collapse,
    preview_url,
    "versioning"
)
SELECT 
    t.table_name,
    NULL,
    NULL,
    NULL,
    false,
    false,
    NULL,
    NULL,
    true,
    NULL,
    NULL,
    NULL,
    'all',
    NULL,
    NULL,
    NULL,
    NULL,
    'open',
    NULL,
    false
FROM information_schema.tables t
LEFT JOIN directus_collections dc 
    ON dc.collection = t.table_name
WHERE t.table_schema IN ('market_data','signals','user_data','system')
  --t.table_schema IN ('allstocker','analytics')  -- 👈 update
  AND t.table_type = 'BASE TABLE'
  AND t.table_name NOT LIKE 'directus_%'
  AND dc.collection IS NULL;


-- Insert collection fields for the new collections

INSERT INTO public.directus_fields (
    collection,
    field,
    special,
    interface,
    "options",
    display,
    display_options,
    readonly,
    hidden,
    sort,
    width,
    translations,
    note,
    conditions,
    required,
    "group",
    validation,
    validation_message,
    searchable
)
SELECT
    c.table_name,
    c.column_name,
    -- special handling
    CASE 
        WHEN c.data_type = 'boolean' THEN 'cast-boolean'
        ELSE NULL
    END,

    NULL,   -- interface (UI sets later if needed)
    NULL,
    NULL,
    NULL,
    false,
    false,
    c.ordinal_position,
    'full',
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    NULL,
    NULL,
    true

FROM information_schema.columns c
LEFT JOIN directus_fields df
    ON df.collection = c.table_name
   AND df.field = c.column_name
WHERE c.table_schema IN ('market_data','signals','user_data','system')
 --c.table_schema IN ('allstocker','analytics')  -- 👈 update
 AND c.table_name NOT LIKE 'directus_%'
  AND df.field IS NULL;