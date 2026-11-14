BEGIN;
CREATE OR REPLACE FUNCTION audit_row_change() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO audit_log(subject_table, subject_id, operation, data)
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id)::text,
        TG_OP,
        to_jsonb(COALESCE(NEW, OLD))
    );
    RETURN COALESCE(NEW, OLD);
END;
$$;
CREATE TRIGGER assets_audit AFTER INSERT OR UPDATE OR DELETE ON assets
FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER observations_audit AFTER INSERT OR UPDATE OR DELETE ON observations
FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER assessments_audit AFTER INSERT OR UPDATE OR DELETE ON assessments
FOR EACH ROW EXECUTE FUNCTION audit_row_change();
COMMIT;
