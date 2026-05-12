-- ============================================================
--  TRADERPRO — FKS TRADERS
--  ALL SUPABASE SQL QUERIES
--  Run in order in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- SECTION 1: CREATE TABLES
-- ============================================================

-- 1.1 Store Settings (one row per user/business)
CREATE TABLE IF NOT EXISTS store_settings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  store_name      text NOT NULL DEFAULT 'FKS Traders',
  tagline         text DEFAULT 'M.S. Pipe, Cast Iron, GI Sheet, Angle Patti, Channel',
  address         text DEFAULT '',
  phone           text DEFAULT '',
  phone2          text DEFAULT '',
  gst_number      text DEFAULT '',
  logo_url        text DEFAULT '',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 1.2 Subscriptions / Plans
CREATE TABLE IF NOT EXISTS subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan            text NOT NULL DEFAULT 'free',   -- 'free' | 'pro' | 'enterprise'
  is_active       boolean DEFAULT true,
  trial_ends_at   timestamptz DEFAULT (now() + interval '14 days'),
  billing_cycle   text DEFAULT 'monthly',          -- 'monthly' | 'yearly'
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 1.3 Products
CREATE TABLE IF NOT EXISTS products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text NOT NULL,
  category        text DEFAULT 'General',
  unit            text DEFAULT 'piece',           -- piece | kg | sheet | meter | liter
  rate            numeric(12,2) NOT NULL DEFAULT 0,
  stock           numeric(12,2) DEFAULT 0,
  min_stock       numeric(12,2) DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 1.4 Customers
CREATE TABLE IF NOT EXISTS customers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text NOT NULL,
  phone           text DEFAULT '',
  address         text DEFAULT '',
  created_at      timestamptz DEFAULT now()
);

-- 1.5 Sales / Daily Entries
CREATE TABLE IF NOT EXISTS sales (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id     uuid REFERENCES customers(id) ON DELETE SET NULL,
  product_id      uuid REFERENCES products(id) ON DELETE SET NULL,
  customer_name   text NOT NULL,                  -- denormalized for display
  product_name    text NOT NULL,                  -- denormalized for display
  qty             numeric(12,2) NOT NULL,
  unit            text DEFAULT 'piece',
  rate            numeric(12,2) NOT NULL,
  amount          numeric(12,2) GENERATED ALWAYS AS (qty * rate) STORED,
  shift           text DEFAULT 'Morning',         -- Morning | Evening
  sale_date       date NOT NULL DEFAULT CURRENT_DATE,
  note            text DEFAULT '',
  created_at      timestamptz DEFAULT now()
);

-- 1.6 Retail Sales (walk-in, no customer account)
CREATE TABLE IF NOT EXISTS retail_sales (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id      uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name    text NOT NULL,
  qty             numeric(12,2) NOT NULL,
  unit            text DEFAULT 'piece',
  rate            numeric(12,2) NOT NULL,
  amount          numeric(12,2) GENERATED ALWAYS AS (qty * rate) STORED,
  payment_mode    text DEFAULT 'Cash',            -- Cash | Online/UPI
  sale_date       date NOT NULL DEFAULT CURRENT_DATE,
  created_at      timestamptz DEFAULT now()
);

-- 1.7 Payments received from customers
CREATE TABLE IF NOT EXISTS payments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id     uuid REFERENCES customers(id) ON DELETE CASCADE,
  customer_name   text NOT NULL,
  amount          numeric(12,2) NOT NULL,
  mode            text DEFAULT 'Cash',            -- Cash | Online/UPI | Cheque
  payment_date    date NOT NULL DEFAULT CURRENT_DATE,
  note            text DEFAULT '',
  created_at      timestamptz DEFAULT now()
);

-- 1.8 Stock Adjustments Log
CREATE TABLE IF NOT EXISTS stock_adjustments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id      uuid REFERENCES products(id) ON DELETE CASCADE,
  product_name    text NOT NULL,
  adjustment      numeric(12,2) NOT NULL,         -- positive = add, negative = remove
  stock_before    numeric(12,2),
  stock_after     numeric(12,2),
  reason          text DEFAULT 'Manual adjustment',
  adjusted_at     timestamptz DEFAULT now()
);

-- 1.9 Generated Bills (PDF + TinyURL records)
CREATE TABLE IF NOT EXISTS bills (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id     uuid REFERENCES customers(id) ON DELETE SET NULL,
  customer_name   text NOT NULL,
  period_start    date NOT NULL,
  period_end      date NOT NULL,
  total_sales     numeric(12,2) DEFAULT 0,
  total_paid      numeric(12,2) DEFAULT 0,
  net_payable     numeric(12,2) DEFAULT 0,
  pdf_url         text,                           -- Supabase Storage signed URL
  short_url       text,                           -- TinyURL shortened link
  created_at      timestamptz DEFAULT now()
);

-- 1.10 Staff / Team Members (Enterprise plan)
CREATE TABLE IF NOT EXISTS team_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  member_user_id  uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text NOT NULL,
  role            text DEFAULT 'staff',           -- admin | staff
  invited_at      timestamptz DEFAULT now(),
  accepted_at     timestamptz
);

-- ============================================================
-- SECTION 2: ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE store_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE products             ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales                ENABLE ROW LEVEL SECURITY;
ALTER TABLE retail_sales         ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills                ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members         ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECTION 3: RLS POLICIES (4 per table: select, insert, update, delete)
-- ============================================================

-- store_settings
CREATE POLICY "store_settings_select" ON store_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "store_settings_insert" ON store_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "store_settings_update" ON store_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "store_settings_delete" ON store_settings FOR DELETE USING (auth.uid() = user_id);

-- subscriptions
CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- products
CREATE POLICY "products_select" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "products_update" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "products_delete" ON products FOR DELETE USING (auth.uid() = user_id);

-- customers
CREATE POLICY "customers_select" ON customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "customers_insert" ON customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "customers_update" ON customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "customers_delete" ON customers FOR DELETE USING (auth.uid() = user_id);

-- sales
CREATE POLICY "sales_select" ON sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sales_insert" ON sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sales_update" ON sales FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sales_delete" ON sales FOR DELETE USING (auth.uid() = user_id);

-- retail_sales
CREATE POLICY "retail_sales_select" ON retail_sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "retail_sales_insert" ON retail_sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "retail_sales_delete" ON retail_sales FOR DELETE USING (auth.uid() = user_id);

-- payments
CREATE POLICY "payments_select" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_insert" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payments_delete" ON payments FOR DELETE USING (auth.uid() = user_id);

-- stock_adjustments
CREATE POLICY "stock_adj_select" ON stock_adjustments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "stock_adj_insert" ON stock_adjustments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- bills
CREATE POLICY "bills_select" ON bills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bills_insert" ON bills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bills_delete" ON bills FOR DELETE USING (auth.uid() = user_id);

-- team_members
CREATE POLICY "team_select" ON team_members FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = member_user_id);
CREATE POLICY "team_insert" ON team_members FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "team_delete" ON team_members FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================
-- SECTION 4: INDEXES (performance)
-- ============================================================

CREATE INDEX idx_products_user      ON products(user_id);
CREATE INDEX idx_customers_user     ON customers(user_id);
CREATE INDEX idx_sales_user         ON sales(user_id);
CREATE INDEX idx_sales_customer     ON sales(customer_id);
CREATE INDEX idx_sales_date         ON sales(sale_date);
CREATE INDEX idx_sales_product      ON sales(product_id);
CREATE INDEX idx_payments_user      ON payments(user_id);
CREATE INDEX idx_payments_customer  ON payments(customer_id);
CREATE INDEX idx_bills_user         ON bills(user_id);
CREATE INDEX idx_bills_customer     ON bills(customer_id);
CREATE INDEX idx_retail_user        ON retail_sales(user_id);
CREATE INDEX idx_retail_date        ON retail_sales(sale_date);
CREATE INDEX idx_stock_adj_product  ON stock_adjustments(product_id);

-- ============================================================
-- SECTION 5: TRIGGERS (auto-updated_at)
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
