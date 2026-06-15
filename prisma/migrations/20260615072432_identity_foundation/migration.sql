-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "auth_user_id" UUID NOT NULL,
    "normalized_email" VARCHAR(320) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "email_verified_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "display_name" VARCHAR(200) NOT NULL,
    "educational_level_label" VARCHAR(120),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "learner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_events" (
    "id" UUID NOT NULL,
    "admin_user_id" UUID NOT NULL,
    "action_type" VARCHAR(100) NOT NULL,
    "target_entity_type" VARCHAR(100) NOT NULL,
    "target_entity_id" VARCHAR(128) NOT NULL,
    "before_summary" JSONB,
    "after_summary" JSONB,
    "reason" VARCHAR(500) NOT NULL,
    "correlation_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_events_pkey" PRIMARY KEY ("id")
);

-- AddConstraint
ALTER TABLE "users" ADD CONSTRAINT "users_auth_user_id_key" UNIQUE ("auth_user_id");

-- AddConstraint
ALTER TABLE "users" ADD CONSTRAINT "users_normalized_email_key" UNIQUE ("normalized_email");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- AddConstraint
ALTER TABLE "learner_profiles" ADD CONSTRAINT "learner_profiles_user_id_key" UNIQUE ("user_id");

-- CreateIndex
CREATE INDEX "admin_audit_events_admin_user_id_created_at_idx" ON "admin_audit_events"("admin_user_id", "created_at");

-- CreateIndex
CREATE INDEX "admin_audit_events_target_entity_type_target_entity_id_idx" ON "admin_audit_events"("target_entity_type", "target_entity_id");

-- AddForeignKey
ALTER TABLE "learner_profiles" ADD CONSTRAINT "learner_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_events" ADD CONSTRAINT "admin_audit_events_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Protect application tables from browser-facing Supabase roles.
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learner_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_audit_events" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "users" FROM anon, authenticated;
REVOKE ALL ON TABLE "learner_profiles" FROM anon, authenticated;
REVOKE ALL ON TABLE "admin_audit_events" FROM anon, authenticated;
