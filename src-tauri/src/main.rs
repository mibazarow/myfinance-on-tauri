#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Account {
    id: u32,
    name: String,
    balance: f64,
}

fn get_accounts_file_path(app_handle: &tauri::AppHandle) -> Result<PathBuf, Box<dyn std::error::Error>> {
    let app_data_dir = app_handle.path().app_data_dir()?;
    fs::create_dir_all(&app_data_dir)?;
    Ok(app_data_dir.join("accounts.json"))
}

#[tauri::command]
fn save_accounts(app_handle: tauri::AppHandle, accounts: Vec<Account>) -> Result<(), String> {
    let accounts_file = get_accounts_file_path(&app_handle).map_err(|e| e.to_string())?;
    let json_str = serde_json::to_string(&accounts).map_err(|e| e.to_string())?;
    fs::write(accounts_file, json_str).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_accounts(app_handle: tauri::AppHandle) -> Result<Vec<Account>, String> {
    let accounts_file = get_accounts_file_path(&app_handle).map_err(|e| e.to_string())?;

    if !accounts_file.exists() {
        // Возвращаем пустой список, если файл не существует
        return Ok(Vec::new());
    }

    let json_str = fs::read_to_string(accounts_file).map_err(|e| e.to_string())?;
    let accounts: Vec<Account> = serde_json::from_str(&json_str).map_err(|e| e.to_string())?;
    Ok(accounts)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![save_accounts, load_accounts])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run();
}
