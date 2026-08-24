(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};

  /**
   * Аналитика и админка (Supabase).
   *
   * НАСТРОЙКА:
   * 1) Создайте проект на https://supabase.com
   * 2) SQL Editor → выполните admin/schema.sql
   * 3) Authentication → Users → Add user (email + пароль автора)
   * 4) Settings → API → скопируйте Project URL и anon public key ниже
   * 5) enabled: true
   *
   * ВАЖНО: в frontend только anon-ключ. service_role ключ НЕ вставлять.
   */
  global.ReadingPortal.analyticsConfig = {
    enabled: false,
    trackLocal: false,
    surveyId: 'photo-diary-v1',
    supabaseUrl: '',
    supabaseAnonKey: '',
    formEndpoint: '',
    gaMeasurementId: ''
  };
})(window);
