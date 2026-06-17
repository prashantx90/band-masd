-- Ensure raw schema exists
CREATE SCHEMA IF NOT EXISTS raw;

-- raw_ingestion_registry: tracks every file downloaded and archived
CREATE TABLE IF NOT EXISTS raw.raw_ingestion_registry (
    id              BIGSERIAL       PRIMARY KEY,

    -- Source identification
    source_name     TEXT            NOT NULL,
    category        TEXT            NOT NULL,
    report_type     TEXT            NOT NULL,

    -- Download provenance
    source_url      TEXT            NOT NULL,
    http_status     INT,

    -- File metadata
    file_name       TEXT            NOT NULL,
    file_extension  TEXT,
    content_type    TEXT,
    content_length  BIGINT,

    -- Integrity
    checksum_sha256 TEXT            NOT NULL,

    -- Storage location (R2 or local)
    storage_backend TEXT            NOT NULL DEFAULT 'local',
    r2_bucket       TEXT,
    r2_object_key   TEXT,
    local_path      TEXT,

    -- Timestamps
    report_date     DATE,
    discovered_at   TIMESTAMPTZ     NOT NULL,
    downloaded_at   TIMESTAMPTZ,

    -- Status tracking
    ingestion_status TEXT           NOT NULL DEFAULT 'PENDING',
    retry_count     INT             DEFAULT 0,
    error_message   TEXT,

    created_at      TIMESTAMPTZ     DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     DEFAULT NOW()
);

-- Dedup: same file content should not be stored twice
CREATE UNIQUE INDEX IF NOT EXISTS ux_ingestion_checksum
    ON raw.raw_ingestion_registry(checksum_sha256);

-- Dedup: same source + date should not have duplicate entries
CREATE UNIQUE INDEX IF NOT EXISTS ux_ingestion_source_date
    ON raw.raw_ingestion_registry(source_name, category, report_type, report_date);

-- Query by status (retry queue, monitoring)
CREATE INDEX IF NOT EXISTS ix_ingestion_status
    ON raw.raw_ingestion_registry(ingestion_status);

-- Query by source + time range
CREATE INDEX IF NOT EXISTS ix_ingestion_source_discovered
    ON raw.raw_ingestion_registry(source_name, discovered_at);