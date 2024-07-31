-- Insert data into user Table
INSERT INTO user (id, name, phone_num, username, password, created_at, updated_at) VALUES ('cb7ab05a-45ab-11ef-af05-401c8383fa1c', 'alfred', 81112222, 'alfredo', '$2b$10$lUV6F99ZbU35eTZwbei93u2foa6osk/byBO9LS2ccNYqkIqMd2iri', NOW(), NOW());
INSERT INTO user (id, name, phone_num, username, password, created_at, updated_at) VALUES ('cb7b5ab7-45ab-11ef-af05-401c8383fa1c', 'dex', 83334444, 'dexty', '$2b$10$lUV6F99ZbU35eTZwbei93u2foa6osk/byBO9LS2ccNYqkIqMd2iri', NOW(), NOW());
INSERT INTO user (id, name, phone_num, username, password, created_at, updated_at) VALUES ('cb7c0d39-45ab-11ef-af05-401c8383fa1c', 'ben', 84445555, 'beanpew', '$2b$10$lUV6F99ZbU35eTZwbei93u2foa6osk/byBO9LS2ccNYqkIqMd2iri', NOW(), NOW());
INSERT INTO user (id, name, phone_num, username, password, created_at, updated_at) VALUES ('cb7ca708-45ab-11ef-af05-401c8383fa1c', 'dano', 85556666, 'dano', '$2b$10$lUV6F99ZbU35eTZwbei93u2foa6osk/byBO9LS2ccNYqkIqMd2iri', NOW(), NOW());
INSERT INTO user (id, name, phone_num, username, password, created_at, updated_at) VALUES ('cb7d1b7b-45ab-11ef-af05-401c8383fa1c', 'huge', 86667777, 'huge', '$2b$10$lUV6F99ZbU35eTZwbei93u2foa6osk/byBO9LS2ccNYqkIqMd2iri', NOW(), NOW());
INSERT INTO user (id, name, phone_num, username, password, created_at, updated_at) VALUES ('cb7d9650-45ab-11ef-af05-401c8383fa1c', 'kzx', 87778888, 'everlastboy', '$2b$10$lUV6F99ZbU35eTZwbei93u2foa6osk/byBO9LS2ccNYqkIqMd2iri', NOW(), NOW());

-- Insert data into contacts Table
INSERT INTO contacts (id, name, phone_num, created_at, updated_at) VALUES ('10d8bd0c-010e-40a8-95bc-a2cd5d4cf819', 'alfred', 81112222, NOW(), NOW());
INSERT INTO contacts (id, name, phone_num, created_at, updated_at) VALUES ('b395c56c-73e6-4c47-bfde-b08bb9f7c272', 'dex', 83334444, NOW(), NOW());
INSERT INTO contacts (id, name, phone_num, created_at, updated_at) VALUES ('068c8d4e-1923-4079-a38e-6742f4d3fb79', 'ben', 84445555, NOW(), NOW());
INSERT INTO contacts (id, name, phone_num, created_at, updated_at) VALUES ('a07798b4-9c99-4dc1-ae01-726cccf57cdd', 'dano', 85556666, NOW(), NOW());
INSERT INTO contacts (id, name, phone_num, created_at, updated_at) VALUES ('3f6217d3-62d7-46d3-9a01-146d80d94423', 'huge', 86667777, NOW(), NOW());


-- Insert data into contacts_users Table
INSERT INTO contacts_users (contacts_id, user_id) VALUES ('10d8bd0c-010e-40a8-95bc-a2cd5d4cf819', 'cb7d9650-45ab-11ef-af05-401c8383fa1c');
INSERT INTO contacts_users (contacts_id, user_id) VALUES ('b395c56c-73e6-4c47-bfde-b08bb9f7c272', 'cb7d9650-45ab-11ef-af05-401c8383fa1c');
INSERT INTO contacts_users (contacts_id, user_id) VALUES ('068c8d4e-1923-4079-a38e-6742f4d3fb79', 'cb7d9650-45ab-11ef-af05-401c8383fa1c');
INSERT INTO contacts_users (contacts_id, user_id) VALUES ('a07798b4-9c99-4dc1-ae01-726cccf57cdd', 'cb7d9650-45ab-11ef-af05-401c8383fa1c');
INSERT INTO contacts_users (contacts_id, user_id) VALUES ('3f6217d3-62d7-46d3-9a01-146d80d94423', 'cb7d9650-45ab-11ef-af05-401c8383fa1c');
