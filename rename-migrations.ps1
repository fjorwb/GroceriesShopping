# Script to rename migration files with timestamps

$migrationsPath = "database/migrations"

# Rename files in the correct order
Rename-Item "$migrationsPath/create-1-users.js" "20231201000000-create-users.js" -ErrorAction SilentlyContinue
Rename-Item "$migrationsPath/create-productcategory.js" "20231202000000-create-productcategory.js" -ErrorAction SilentlyContinue
Rename-Item "$migrationsPath/create-market.js" "20231203000000-create-market.js" -ErrorAction SilentlyContinue
Rename-Item "$migrationsPath/create-product.js" "20231204000000-create-product.js" -ErrorAction SilentlyContinue
Rename-Item "$migrationsPath/create-ingredients.js" "20231205000000-create-ingredients.js" -ErrorAction SilentlyContinue
Rename-Item "$migrationsPath/create-recipes.js" "20231206000000-create-recipes.js" -ErrorAction SilentlyContinue
Rename-Item "$migrationsPath/create-menu.js" "20231207000000-create-menu.js" -ErrorAction SilentlyContinue
Rename-Item "$migrationsPath/create-shoppinglist.js" "20231208000000-create-shoppinglist.js" -ErrorAction SilentlyContinue
Rename-Item "$migrationsPath/create-productMock.js" "20231209000000-create-productMock.js" -ErrorAction SilentlyContinue
Rename-Item "$migrationsPath/add-foreign-keys.js" "20231210000000-add-foreign-keys.js" -ErrorAction SilentlyContinue
Rename-Item "$migrationsPath/add-indexes.js" "20231211000000-add-indexes.js" -ErrorAction SilentlyContinue

Write-Host "Migration files renamed successfully!" -ForegroundColor Green
