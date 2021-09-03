CREATE schema IF NOT EXISTS spbdt;

CREATE TABLE IF NOT EXISTS spbdt.user (
    id SERIAL PRIMARY KEY, 
    username TEXT
    -- entity_id INTEGER, 
    -- treating_doc_id INTEGER, 
    -- service_center_id INTEGER, 
    -- booking_type_id INTEGER,
    -- location_id INTEGER,
    -- name TEXT,

    -- booking_status_changes JSONB default '{}' not null,
    -- last_touch TIMESTAMP, 
    -- lastpost timestamp without time zone DEFAULT now(),
    -- settings jsonb DEFAULT '{}'::jsonb
    );