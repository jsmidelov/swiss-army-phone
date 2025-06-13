/* DB init for digital-wellness-radar */
-- Create database
CREATE DATABASE "digital_wellness_radar" WITH OWNER "postgres" ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8' TABLESPACE "pg_default" CONNECTION LIMIT -1;
-- Connect to the database
\c "digital_wellness_radar" "postgres"
-- Set search path to public schema
SET search_path TO "public";

CREATE TABLE "public"."app_store" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);
INSERT INTO "public"."app_store" ("name") VALUES ('Apple App Store'), ('Google Play Store'), ('Both');

CREATE TABLE "public"."app_rating" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);
INSERT INTO "public"."app_rating" ("name") VALUES ('Tool'), ('Sugar'), ('Coffee'), ('Alcohol'), ('Drug');

CREATE TABLE "public". "app_category" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);
INSERT INTO "public"."app_category" ("name") VALUES ('Education'), ('Entertainment'), ('Health & Fitness'), ('Social'), ('Productivity'), ('Business'), ('Games');

CREATE TABLE "public"."business_model" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);
INSERT INTO "public"."business_model" ("name") VALUES ('Freemium'), ('In-App Purchases'), ('Advertising'), ('Subscription'), ('Pay Once');

/* Create tables  */
CREATE TABLE "public"."rating_factors" (
    "id" UUID PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "weight" TEXT NOT NULL
);
CREATE TABLE "public"."apps" (
    "id" UUID PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "store_id" INTEGER NOT NULL REFERENCES "public"."app_store"("id"),
    "rating_id" INTEGER NOT NULL REFERENCES "public"."app_rating"("id"),
    "description" TEXT NOT NULL,
    "category" INTEGER NOT NULL REFERENCES "public"."app_category"("id"),
    "developer" TEXT NOT NULL,
    "business_model" INTEGER NOT NULL REFERENCES "public"."business_model"("id"),
    "last_updated" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "store_app_id" TEXT
);
CREATE TABLE "public"."apps_rating_factors" (
    "app_id" UUID NOT NULL,
    "rating_id" UUID NOT NULL,
    "is_present" BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY ("app_id", "rating_id"),
    FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE CASCADE,
    FOREIGN KEY ("rating_id") REFERENCES "public"."rating_factors"("id") ON DELETE CASCADE
);
/* Create indexes */
CREATE INDEX "idx_apps_rating_factors_app_id" ON "public"."apps_rating_factors" ("app_id");
CREATE INDEX "idx_apps_rating_factors_rating_id" ON "public"."apps_rating_factors" ("rating_id");
CREATE INDEX "idx_rating_factors_name" ON "public"."rating_factors" ("name");
CREATE INDEX "idx_apps_name" ON "public"."apps" ("name");
CREATE INDEX "idx_apps_store" ON "public"."apps" ("store_id");
CREATE INDEX "idx_apps_category" ON "public"."apps" ("category");
CREATE INDEX "idx_apps_developer" ON "public"."apps" ("developer");
CREATE INDEX "idx_apps_business_model" ON "public"."apps" ("business_model");
CREATE INDEX "idx_apps_last_updated" ON "public"."apps" ("last_updated");
CREATE INDEX "idx_apps_created_at" ON "public"."apps" ("created_at");
CREATE INDEX "idx_rating_factors_created_at" ON "public"."rating_factors" ("created_at");
CREATE INDEX "idx_rating_factors_weight" ON "public"."rating_factors" ("weight");

/* Create sample data for rating_factors and apps tables */

/* Create rating_factors data */
INSERT INTO "public"."rating_factors" ("id", "name", "description", "created_at", "weight") VALUES ('1c5c2cdb-cec2-4470-8eaf-45495027abd0', 'Business Model: In-App Purchases', 'App uses psychological triggers to encourage impulse purchases.', '2025-04-29 12:04:30.674794+00', '2'), ('6d9f4a13-fa2e-4d17-962d-36aeabf46fd5', 'Artificial Urgency', 'Countdowns and time pressures that force quick decisions.', '2025-04-29 11:59:56.068033+00', '1'), ('75b7c3e7-310d-4d5f-a451-ef6e5fa7f853', 'FOMO Triggers', 'Elements that create Fear Of Missing Out.', '2025-04-29 11:59:56.068033+00', '1'), ('82d82466-b6e4-4e1b-ab53-b4cdc4357334', 'Variable Rewards', 'Unpredictable rewards that create addiction through anticipation.', '2025-04-29 11:59:56.068033+00', '1'), ('c705095f-791c-4c97-8157-9bb2e3ba458d', 'Autoplay', 'Content that automatically plays the next item without user action.', '2025-04-29 11:59:56.068033+00', '1'), ('eb48c3f1-b7e0-4373-bc2b-f97207bae384', 'Business Model: Advertising', 'App makes money by showing ads, incentivizing longer usage times to increase ad impressions.', '2025-04-29 12:03:58.003139+00', '2'), ('f227a96a-3937-4e7b-8a14-f851dd9c5315', 'Social Validation', 'Features that tie self-worth to social approval metrics.', '2025-04-29 11:59:56.068033+00', '1'), ('f99f9c4e-2793-4e99-ae90-91adb381661e', 'Gamification Elements', 'Points, badges, and streaks that create engagement loops.', '2025-04-29 11:59:56.068033+00', '1'), ('fa696e36-4aa2-41e9-94b5-47e234a7e3fe', 'Push Notifications', 'Excessive alerts that pull users back into the app.', '2025-04-29 11:59:56.068033+00', '1'), ('ff1cfa1f-79ca-49c7-b89a-8f5f7a5f38d0', 'Infinite Scroll', 'Content that loads endlessly as you scroll, eliminating natural stopping points.', '2025-04-29 11:59:56.068033+00', '1');

/* Create apps data */
INSERT INTO "public"."apps"
    ("id", "name", "icon", "store_id", "rating_id", "description", "category", "developer", "business_model", "last_updated", "created_at", "store_app_id")
VALUES 
    ('15e69b84-9adb-4e3c-9c01-7b8106cd548d', 'Duolingo', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Duolingo_logo.svg/1200px-Duolingo_logo.svg.png', 3, 2, 'Language learning platform', 1, 'Duolingo, Inc.', 1, '2025-04-28 07:04:28.061749+00', '2025-04-28 07:04:28.061749+00', null),
    ('20a06153-2476-4f58-bcde-fb0a95894bbc', 'YouTube', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png', 3, 4, 'Video sharing platform', 2, 'Google LLC', 3, '2025-04-29 08:54:33.656943+00', '2025-04-29 08:54:33.656943+00', null),
    ('27b6ee30-23ee-49ed-912f-ca8fc15a85dc', 'Headspace', 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Headspace_logo.svg', 3, 1, 'Meditation and mindfulness app', 3, 'Headspace Inc.', 4, '2025-04-28 07:04:28.061749+00', '2025-04-28 07:04:28.061749+00', null),
    ('6517cce1-16a8-4be0-8472-7a17d7e8bdf7', 'Netflix', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png', 3, 4, 'Subscription-based streaming service', 2, 'Netflix, Inc.', 4, '2025-04-29 08:54:33.656943+00', '2025-04-29 08:54:33.656943+00', null),
    ('71e663f5-adcb-4fd9-9e1c-14005f1e612f', 'Instagram', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1024px-Instagram_logo_2022.svg.png', 3, 5, 'Photo and video sharing social networking service', 4, 'Meta', 3, '2025-04-29 08:54:33.656943+00', '2025-04-29 08:54:33.656943+00', null),
    ('72fc77c2-25f6-4bc9-a1d6-7033edfafa00', 'Gmail', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png', 3, 2, 'Email service developed by Google', 5, 'Google LLC', 3, '2025-04-29 08:54:33.656943+00', '2025-04-29 08:54:33.656943+00', null),
    ('8c14ef68-0e1b-4c67-8002-6ca950578dfc', 'Forest', 'https://play-lh.googleusercontent.com/l4maMYOgJGZO2TD6ltclHJaM-ZWdfA8xQo40ZK-YYtN0yEqlgClCG0uVpgk6I1JqbcgL=w240-h480-rw', 3, 1, 'Stay focused, be present', 5, 'Seekrtech', 5, '2025-04-28 07:04:28.061749+00', '2025-04-28 07:04:28.061749+00', null),
    ('aab9b18a-8fb2-4fa1-970c-4b1b9e6b56a3', 'Apple Calendar', 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Calendar_App_from_iOS_13.png', 1, 1, 'Calendar and scheduling app', 5, 'Apple Inc.', 5, '2025-04-29 08:54:33.656943+00', '2025-04-29 08:54:33.656943+00', null),
    ('aacb0cca-1847-4676-ae91-2c24e936caaf', 'Slack', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png', 3, 3, 'Business communication platform', 6, 'Slack Technologies', 4, '2025-04-29 08:54:33.656943+00', '2025-04-29 08:54:33.656943+00', null),
    ('abcff701-03b5-4d86-a7be-ff0b2b442e9f', 'TikTok', 'https://sf-tb-sg.ibytedtos.com/obj/eden-sg/uhtyvueh7nulogpoguhm/tiktok-icon2.png', 3, 5, 'Short-form, video-sharing app for entertainment', 2, 'ByteDance', 3, '2025-04-28 07:04:28.061749+00', '2025-04-28 07:04:28.061749+00', null),
    ('bed92b70-68e6-4420-8686-1b40bfe1819f', 'Candy Crush Saga', 'https://upload.wikimedia.org/wikipedia/en/3/36/Candy_Crush_logo.png', 3, 5, 'Match-three puzzle game', 7, 'King', 2, '2025-04-29 08:54:33.656943+00', '2025-04-29 08:54:33.656943+00', null),
    ('e58b87f2-27c6-404b-bf5d-5380493ffa43', 'Notion', 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png', 3, 1, 'All-in-one workspace for notes, tasks, wikis, and databases', 5, 'Notion Labs', 4, '2025-04-28 07:04:28.061749+00', '2025-04-28 07:04:28.061749+00', null);

/* Create relationship table data */
INSERT INTO "public"."apps_rating_factors" ("app_id", "rating_id", "is_present") VALUES ('15e69b84-9adb-4e3c-9c01-7b8106cd548d', '6d9f4a13-fa2e-4d17-962d-36aeabf46fd5', 'true'), ('15e69b84-9adb-4e3c-9c01-7b8106cd548d', '75b7c3e7-310d-4d5f-a451-ef6e5fa7f853', 'false'), ('15e69b84-9adb-4e3c-9c01-7b8106cd548d', '82d82466-b6e4-4e1b-ab53-b4cdc4357334', 'true'), ('15e69b84-9adb-4e3c-9c01-7b8106cd548d', 'c705095f-791c-4c97-8157-9bb2e3ba458d', 'false'), ('15e69b84-9adb-4e3c-9c01-7b8106cd548d', 'f227a96a-3937-4e7b-8a14-f851dd9c5315', 'false'), ('15e69b84-9adb-4e3c-9c01-7b8106cd548d', 'f99f9c4e-2793-4e99-ae90-91adb381661e', 'true'), ('15e69b84-9adb-4e3c-9c01-7b8106cd548d', 'fa696e36-4aa2-41e9-94b5-47e234a7e3fe', 'true'), ('15e69b84-9adb-4e3c-9c01-7b8106cd548d', 'ff1cfa1f-79ca-49c7-b89a-8f5f7a5f38d0', 'false'), ('27b6ee30-23ee-49ed-912f-ca8fc15a85dc', '6d9f4a13-fa2e-4d17-962d-36aeabf46fd5', 'false'), ('27b6ee30-23ee-49ed-912f-ca8fc15a85dc', '75b7c3e7-310d-4d5f-a451-ef6e5fa7f853', 'false'), ('27b6ee30-23ee-49ed-912f-ca8fc15a85dc', '82d82466-b6e4-4e1b-ab53-b4cdc4357334', 'false'), ('27b6ee30-23ee-49ed-912f-ca8fc15a85dc', 'c705095f-791c-4c97-8157-9bb2e3ba458d', 'false'), ('27b6ee30-23ee-49ed-912f-ca8fc15a85dc', 'f227a96a-3937-4e7b-8a14-f851dd9c5315', 'false'), ('27b6ee30-23ee-49ed-912f-ca8fc15a85dc', 'f99f9c4e-2793-4e99-ae90-91adb381661e', 'false'), ('27b6ee30-23ee-49ed-912f-ca8fc15a85dc', 'fa696e36-4aa2-41e9-94b5-47e234a7e3fe', 'true'), ('27b6ee30-23ee-49ed-912f-ca8fc15a85dc', 'ff1cfa1f-79ca-49c7-b89a-8f5f7a5f38d0', 'false'), ('8c14ef68-0e1b-4c67-8002-6ca950578dfc', '6d9f4a13-fa2e-4d17-962d-36aeabf46fd5', 'false'), ('8c14ef68-0e1b-4c67-8002-6ca950578dfc', '75b7c3e7-310d-4d5f-a451-ef6e5fa7f853', 'false'), ('8c14ef68-0e1b-4c67-8002-6ca950578dfc', '82d82466-b6e4-4e1b-ab53-b4cdc4357334', 'false'), ('8c14ef68-0e1b-4c67-8002-6ca950578dfc', 'c705095f-791c-4c97-8157-9bb2e3ba458d', 'false'), ('8c14ef68-0e1b-4c67-8002-6ca950578dfc', 'f227a96a-3937-4e7b-8a14-f851dd9c5315', 'false'), ('8c14ef68-0e1b-4c67-8002-6ca950578dfc', 'f99f9c4e-2793-4e99-ae90-91adb381661e', 'true'), ('8c14ef68-0e1b-4c67-8002-6ca950578dfc', 'fa696e36-4aa2-41e9-94b5-47e234a7e3fe', 'true'), ('8c14ef68-0e1b-4c67-8002-6ca950578dfc', 'ff1cfa1f-79ca-49c7-b89a-8f5f7a5f38d0', 'false'), ('abcff701-03b5-4d86-a7be-ff0b2b442e9f', '6d9f4a13-fa2e-4d17-962d-36aeabf46fd5', 'false'), ('abcff701-03b5-4d86-a7be-ff0b2b442e9f', '75b7c3e7-310d-4d5f-a451-ef6e5fa7f853', 'false'), ('abcff701-03b5-4d86-a7be-ff0b2b442e9f', '82d82466-b6e4-4e1b-ab53-b4cdc4357334', 'true'), ('abcff701-03b5-4d86-a7be-ff0b2b442e9f', 'c705095f-791c-4c97-8157-9bb2e3ba458d', 'true'), ('abcff701-03b5-4d86-a7be-ff0b2b442e9f', 'f227a96a-3937-4e7b-8a14-f851dd9c5315', 'true'), ('abcff701-03b5-4d86-a7be-ff0b2b442e9f', 'f99f9c4e-2793-4e99-ae90-91adb381661e', 'false'), ('abcff701-03b5-4d86-a7be-ff0b2b442e9f', 'fa696e36-4aa2-41e9-94b5-47e234a7e3fe', 'true'), ('abcff701-03b5-4d86-a7be-ff0b2b442e9f', 'ff1cfa1f-79ca-49c7-b89a-8f5f7a5f38d0', 'true'), ('e58b87f2-27c6-404b-bf5d-5380493ffa43', '6d9f4a13-fa2e-4d17-962d-36aeabf46fd5', 'false'), ('e58b87f2-27c6-404b-bf5d-5380493ffa43', '75b7c3e7-310d-4d5f-a451-ef6e5fa7f853', 'false'), ('e58b87f2-27c6-404b-bf5d-5380493ffa43', '82d82466-b6e4-4e1b-ab53-b4cdc4357334', 'false'), ('e58b87f2-27c6-404b-bf5d-5380493ffa43', 'c705095f-791c-4c97-8157-9bb2e3ba458d', 'false'), ('e58b87f2-27c6-404b-bf5d-5380493ffa43', 'f227a96a-3937-4e7b-8a14-f851dd9c5315', 'false'), ('e58b87f2-27c6-404b-bf5d-5380493ffa43', 'f99f9c4e-2793-4e99-ae90-91adb381661e', 'false'), ('e58b87f2-27c6-404b-bf5d-5380493ffa43', 'fa696e36-4aa2-41e9-94b5-47e234a7e3fe', 'true'), ('e58b87f2-27c6-404b-bf5d-5380493ffa43', 'ff1cfa1f-79ca-49c7-b89a-8f5f7a5f38d0', 'false');

/* Create unique constraints */
ALTER TABLE "public"."rating_factors" ADD CONSTRAINT "unique_rating_factors_name" UNIQUE ("name");
ALTER TABLE "public"."apps" ADD CONSTRAINT "unique_apps_name" UNIQUE ("name");
ALTER TABLE "public"."apps" ADD CONSTRAINT "unique_apps_store_app_id" UNIQUE ("store_app_id");
/* Create foreign key constraints */
ALTER TABLE "public"."apps_rating_factors" ADD CONSTRAINT "fk_apps_rating_factors_app_id" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE CASCADE;
ALTER TABLE "public"."apps_rating_factors" ADD CONSTRAINT "fk_apps_rating_factors_rating_id" FOREIGN KEY ("rating_id") REFERENCES "public"."rating_factors"("id") ON DELETE CASCADE;

/* Change apps_rating_factors primary key to a compound key of app_id and rating_id */
ALTER TABLE "public"."apps_rating_factors" DROP CONSTRAINT "apps_rating_factors_pkey";
ALTER TABLE "public"."apps_rating_factors" ADD PRIMARY KEY ("app_id", "rating_id");

CREATE OR REPLACE VIEW app_details_view AS
SELECT 
        apps.id AS id,
        apps.name AS name,
        apps.icon AS icon,
        store.name AS store,
        rating.name AS rating,
        apps.description AS description,
        category.name AS category,
        apps.developer AS developer,
        bus.name AS businessModel,
        ARRAY_AGG(
            json_build_object(
                'name', rf.name,
                'description', rf.description,
                'present', arf.is_present
            )
        ) AS factors
    FROM 
        apps
    LEFT JOIN 
        apps_rating_factors arf ON apps.id = arf.app_id
    LEFT JOIN 
        rating_factors rf ON arf.rating_id = rf.id
    LEFt JOIN 
        app_rating rating ON apps.rating_id = rating.id
    LEFT JOIN
        app_category category ON apps.category = category.id
    LEFT JOIN
        app_store store ON apps.store_id = store.id
    LEFT JOIN
        business_model bus ON apps.business_model = bus.id
    GROUP BY 
        apps.id,
        apps.name,
        apps.icon,
        store.name,
        rating.name,
        apps.description,
        category.name,
        apps.developer,
        bus.name;