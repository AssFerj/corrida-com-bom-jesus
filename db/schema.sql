-- Schema das inscrições. Pode ser executado várias vezes (idempotente).

-- Configurações do evento (linha única, id = 1).
-- Também serve de "trava" da fila: cada nova inscrição bloqueia esta linha
-- (SELECT ... FOR UPDATE), então as inscrições entram uma de cada vez.
CREATE TABLE IF NOT EXISTS settings (
  id                  smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  pix_key             text        NOT NULL DEFAULT '',
  pix_holder          text        NOT NULL DEFAULT '',
  whatsapp            text        NOT NULL DEFAULT '',
  fee_cents           integer     NOT NULL DEFAULT 1000 CHECK (fee_cents >= 0),
  max_registrations   integer              CHECK (max_registrations IS NULL OR max_registrations > 0),
  registrations_open  boolean     NOT NULL DEFAULT true,
  updated_at          timestamptz NOT NULL DEFAULT now()
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS registrations (
  id               bigserial   PRIMARY KEY,
  -- Número da inscrição: ordem de chegada na fila, sem buracos.
  number           integer     NOT NULL UNIQUE,
  -- Gerada pelo navegador a cada envio: reenvios do mesmo formulário não duplicam.
  idempotency_key  uuid        NOT NULL UNIQUE,
  name             text        NOT NULL CHECK (length(name) BETWEEN 3 AND 120),
  phone            text        NOT NULL CHECK (phone ~ '^[0-9]{10,11}$'),
  modality         text        NOT NULL CHECK (modality IN ('3km', '5km')),
  category         text        NOT NULL CHECK (category IN ('masculino', 'feminino')),
  status           text        NOT NULL DEFAULT 'pendente'
                               CHECK (status IN ('pendente', 'confirmada', 'cancelada')),
  kit_delivered    boolean     NOT NULL DEFAULT false,
  notes            text        NOT NULL DEFAULT '',
  -- Controle de concorrência: toda alteração exige a versão que o admin estava vendo.
  version          integer     NOT NULL DEFAULT 1,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  confirmed_at     timestamptz
);

CREATE INDEX IF NOT EXISTS registrations_status_idx ON registrations (status);
CREATE INDEX IF NOT EXISTS registrations_phone_idx  ON registrations (phone);

-- Histórico de tudo o que acontece com cada inscrição.
CREATE TABLE IF NOT EXISTS registration_events (
  id               bigserial   PRIMARY KEY,
  registration_id  bigint      NOT NULL REFERENCES registrations (id) ON DELETE RESTRICT,
  type             text        NOT NULL,
  detail           jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS registration_events_reg_idx ON registration_events (registration_id, created_at);
