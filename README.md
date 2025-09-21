# Мои финансы (Tauri v2 версия)

Приложение "Мои финансы", простая утилитка для ведения и подсчета собственных финансов.

## Демонстрация приложения

<iframe width="934" height="525" src="https://www.youtube.com/embed/Y4TyerI-lfM" title="Мои финансы приложенька" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Преимущества Tauri v2 перед Electron
- Значительно меньший размер приложения (в десятки раз)
- Более высокая производительность
- Использование системного WebView вместо полной установки Chromium
- Безопасность, обеспечиваемая Rust
- Доступ к нативным API через Rust
- Улучшенная система плагинов (v2)
- Поддержка мобильных платформ (iOS/Android) в v2
- Обновленная архитектура и API

## Установка и запуск

### Требования
- [Node.js](https://nodejs.org/) (рекомендуется версия 18 или новее)
- [Rust](https://www.rust-lang.org/tools/install) (версия 1.70 или новее)
- Зависимости для Tauri v2 (см. [официальную документацию](https://tauri.app/v1/guides/getting-started/prerequisites/))

### Настройка окружения на Windows

Для корректной сборки приложения на Windows требуется выполнить следующие шаги:

1. **Установка Microsoft Visual Studio Build Tools**
   - Скачайте и установите [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - При установке выберите компонент "C++ Build Tools"
   - Убедитесь, что установлены следующие компоненты:
     - MSVC Компоненты для C++
     - Windows 10 SDK
     - C++ CMake tools для Windows

2. **Установка WebView2**
   - Скачайте и установите [Microsoft Edge WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
   - Этот компонент необходим для рендеринга пользовательского интерфейса

3. **Проверка Rust**
   ```powershell
   rustc --version
   cargo --version
   ```
   - Если Rust не установлен, следуйте инструкциям на [официальном сайте Rust](https://www.rust-lang.org/tools/install)

4. **Настройка переменных окружения**
   - Убедитесь, что переменные окружения для Visual Studio Build Tools корректно настроены
   - В PowerShell можно активировать Developer Command Prompt через:
   ```powershell
   & "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" -arch=x64
   ```

### Установка зависимостей

```bash
# Установка Tauri CLI (v2)
npm install -g @tauri-apps/cli@^2.0.0

# Установка зависимостей проекта
cd myfinance-on-tauri
npm install
```

### Запуск в режиме разработки

```bash
cd myfinance-on-tauri
npm run dev
```

### Сборка приложения

```bash
cd myfinance-on-tauri
npm run build
```

После сборки исполняемые файлы будут доступны в директории `src-tauri/target/release/bundle`.

#### Особенности сборки на Windows

Если при сборке на Windows возникают проблемы, попробуйте следующее:

1. **Запуск в Developer Command Prompt**
   ```powershell
   # Активация Developer Command Prompt
   & "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" -arch=x64

   # Сборка проекта
   cd путь\к\проекту
   npm run build
   ```

2. **Решение проблемы с dlltool.exe**
   - Если возникает ошибка "Error calling dlltool 'dlltool.exe': program not found",
     убедитесь, что установлены LLVM tools или MinGW
   - Вы можете установить [LLVM](https://github.com/llvm/llvm-project/releases) или [MinGW](https://www.mingw-w64.org/downloads/)
   - Добавьте путь к бинарным файлам в PATH

3. **Очистка кеша Cargo**
   ```powershell
   cargo clean
   ```

4. **Обновление Rust и компонентов**
   ```powershell
   rustup update
   ```

## Структура проекта

- `src/` - Веб-часть приложения (HTML, CSS, JavaScript)
- `src-tauri/` - Rust код и конфигурация Tauri
  - `src/main.rs` - Главный Rust файл с бэкендом приложения
  - `tauri.conf.json` - Конфигурация Tauri
  - `Cargo.toml` - Управление зависимостями Rust

## Функциональность

Приложение позволяет:
- При первом запуске приложения автоматически создаются два демо-счета:
   - Сбербанк со случайным балансом от 50,000 до 150,000 рублей
   - Тинькофф со случайным балансом от 30,000 до 110,000 рублей
- Добавлять банковские счета
- Указывать баланс каждого счета
- Подсчитывать итоговую сумму по всем счетам
- Сохранять данные между запусками приложения
- Удалять счета

## Отличия от Cordova/Electron версии

- Вместо localStorage используется хранение в файловой системе через Rust API
- Нет необходимости в плагинах для доступа к нативным функциям
- Значительно меньший размер приложения
- Более высокая производительность

## Обновление до Tauri v2

Это приложение было успешно обновлено с Tauri v1.4 до v2.8.5. Основные изменения:

- **Новая система плагинов**: используется `tauri-plugin-shell` для доступа к системным функциям
- **Обновленная конфигурация**: `tauri.conf.json` использует новый формат v2
- **Глобальный API**: доступ к Tauri API через `window.__TAURI__` (включено `withGlobalTauri: true`)
- **ES модули**: полная поддержка современных JavaScript модулей
- **Улучшенная безопасность**: обновленные CSP политики и управление разрешениями

## Дорожная карта развития

- ✅ **v2.0.1**: Обновление до Tauri v2.8.5, улучшенная архитектура
- 🔄 Улучшение интерфейса
- 📱 Возможное добавление мобильной версии (iOS/Android) благодаря Tauri v2

## Решение проблем

### Проблемы с правами PowerShell

Если PowerShell выдает ошибку о запрещенном выполнении скриптов, выполните:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Проблемы с зависимостями Rust

Если возникают ошибки с зависимостями Rust, проверьте:

1. **Совместимость версий** - Убедитесь, что в `Cargo.toml` указана поддерживаемая версия edition (2015, 2018, 2021, 2024)
2. **Очистите кеш Cargo**
   ```powershell
   cargo clean
   ```
3. **Удалите lock-файлы при необходимости**
   ```powershell
   rm Cargo.lock
   rm package-lock.json
   ```

### Запуск при отсутствии некоторых системных компонентов

Если приложение не запускается у конечного пользователя:
1. Убедитесь, что установлен [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
2. Проверьте наличие Visual C++ Redistributable (можно включить в установщик)

## Лицензия

MIT
