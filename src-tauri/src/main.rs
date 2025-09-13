#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;
use std::path::PathBuf;
use tauri::api::path;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Account {
    id: u32,
    name: String,
    balance: f64,
}

fn get_accounts_file_path() -> PathBuf {
    let app_data_dir = path::app_data_dir(&tauri::Config::default()).unwrap();
    fs::create_dir_all(&app_data_dir).unwrap();
    app_data_dir.join("accounts.json")
}

#[tauri::command]
fn save_accounts(accounts: Vec<Account>) -> Result<(), String> {
    let accounts_file = get_accounts_file_path();
    let json_str = serde_json::to_string(&accounts).map_err(|e| e.to_string())?;
    fs::write(accounts_file, json_str).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_accounts() -> Result<Vec<Account>, String> {
    let accounts_file = get_accounts_file_path();

    if !accounts_file.exists() {
        // Возвращаем пустой список, если файл не существует
        return Ok(Vec::new());
    }

    let json_str = fs::read_to_string(accounts_file).map_err(|e| e.to_string())?;
    let accounts: Vec<Account> = serde_json::from_str(&json_str).map_err(|e| e.to_string())?;
    Ok(accounts)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_accounts, load_accounts])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
