-- ============================================================
-- WoorkFlow — Schema do Banco de Dados MySQL
-- Execute este arquivo para criar todas as tabelas
-- Comando: mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS woorkflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE woorkflow;

-- ── Usuários ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120)        NOT NULL,
  email      VARCHAR(180)        NOT NULL UNIQUE,
  password   VARCHAR(255)        NOT NULL,
  avatar     VARCHAR(10)         DEFAULT NULL,
  created_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Projetos ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150)        NOT NULL,
  description TEXT                DEFAULT NULL,
  color       VARCHAR(10)         DEFAULT '#2563eb',
  deadline    DATE                DEFAULT NULL,
  owner_id    INT UNSIGNED        NOT NULL,
  created_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Membros de projetos ────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_members (
  project_id INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NOT NULL,
  role       ENUM('owner', 'member') DEFAULT 'member',
  joined_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Tarefas ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id  INT UNSIGNED        NOT NULL,
  title       VARCHAR(200)        NOT NULL,
  description TEXT                DEFAULT NULL,
  status      ENUM('todo','doing','done') DEFAULT 'todo',
  priority    ENUM('baixa','media','alta') DEFAULT 'media',
  deadline    DATE                DEFAULT NULL,
  assignee_id INT UNSIGNED        DEFAULT NULL,
  created_by  INT UNSIGNED        NOT NULL,
  created_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users(id)    ON DELETE SET NULL,
  FOREIGN KEY (created_by)  REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Índices para performance ──────────────────────────────
CREATE INDEX idx_tasks_project    ON tasks(project_id);
CREATE INDEX idx_tasks_assignee   ON tasks(assignee_id);
CREATE INDEX idx_tasks_status     ON tasks(status);
CREATE INDEX idx_projects_owner   ON projects(owner_id);
