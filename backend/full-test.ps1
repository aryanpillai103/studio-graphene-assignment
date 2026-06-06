# full-test.ps1 - Comprehensive Backend Testing


Write-Host "`n🧪 FULL API TEST SUITE" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# Clear previous test data
Write-Host "Cleaning up old test data..." -ForegroundColor Yellow
Remove-Item tasks.db -ErrorAction SilentlyContinue
# Need to restart server to recreate database
Write-Host "⚠️  Please restart your backend server (Ctrl+C then npm run dev)" -ForegroundColor Yellow
Read-Host "Press Enter after restarting server"

$baseUrl = "http://localhost:3001"
$passed = 0
$failed = 0

function Test-Case {
    param($name, $script)
    Write-Host "`n📋 Testing: $name" -ForegroundColor Yellow
    try {
        & $script
        Write-Host "   ✅ PASSED" -ForegroundColor Green
        $global:passed++
    } catch {
        Write-Host "   ❌ FAILED: $_" -ForegroundColor Red
        $global:failed++
    }
}

# Test 1: Health Check
Test-Case "Health Check" {
    $response = Invoke-RestMethod "$baseUrl/api/health"
    if ($response.status -ne "ok") { throw "Health check failed" }
}

# Test 2: Create Task (Title Only)
Test-Case "Create Task - Title Only" {
    $body = @{ title = "Test Task 1" } | ConvertTo-Json
    $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/api/tasks" -Body $body -ContentType "application/json"
    if (-not $response.id) { throw "No ID returned" }
    if ($response.title -ne "Test Task 1") { throw "Title mismatch" }
    $global:createdTaskId = $response.id
}

# Test 3: Create Task (All Fields)
Test-Case "Create Task - All Fields" {
    $body = @{
        title = "Complete Project"
        description = "Finish the task manager app"
        dueDate = "2024-12-31"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/api/tasks" -Body $body -ContentType "application/json"
    if (-not $response.description) { throw "Description not saved" }
    if (-not $response.due_date) { throw "Due date not saved" }
    $global:fullTaskId = $response.id
}

# Test 4: Create Task (Empty Title - Should Fail)
Test-Case "Validation - Empty Title" {
    try {
        $body = @{ title = "   " } | ConvertTo-Json
        $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/api/tasks" -Body $body -ContentType "application/json"
        throw "Should have rejected empty title"
    } catch {
        if ($_.Exception.Message -notmatch "400") { 
            throw "Wrong error code: $_" 
        }
    }
}

# Test 5: Get All Tasks
Test-Case "Get All Tasks" {
    $response = Invoke-RestMethod "$baseUrl/api/tasks"
    if ($response.Count -lt 2) { throw "Should have at least 2 tasks, got $($response.Count)" }
    Write-Host "   Tasks found: $($response.Count)" -ForegroundColor Gray
}

# Test 6: Filter Active Tasks
Test-Case "Filter Active Tasks" {
    $response = Invoke-RestMethod "$baseUrl/api/tasks?status=active"
    Write-Host "   Active tasks: $($response.Count)" -ForegroundColor Gray
    foreach ($task in $response) {
        if ($task.completed) { throw "Active filter returned completed task: $($task.title)" }
    }
}

# Test 7: Filter Completed Tasks
Test-Case "Filter Completed Tasks" {
    $response = Invoke-RestMethod "$baseUrl/api/tasks?status=completed"
    Write-Host "   Completed tasks: $($response.Count)" -ForegroundColor Gray
    # Should be 0 since no tasks completed yet
    if ($response.Count -ne 0) { throw "Should have 0 completed tasks" }
}

# Test 8: Search Tasks
Test-Case "Search Tasks by Title" {
    $response = Invoke-RestMethod "$baseUrl/api/tasks?search=Complete"
    if ($response.Count -eq 0) { throw "Search for 'Complete' returned no results" }
    Write-Host "   Found: $($response[0].title)" -ForegroundColor Gray
}

# Test 9: Search Tasks (Case Insensitive)
Test-Case "Search Tasks - Case Insensitive" {
    $response = Invoke-RestMethod "$baseUrl/api/tasks?search=test"
    if ($response.Count -eq 0) { throw "Case-insensitive search failed" }
    Write-Host "   Found $($response.Count) tasks with 'test'" -ForegroundColor Gray
}

# Test 10: Toggle Task Completion
Test-Case "Toggle Task Completion" {
    $tasks = Invoke-RestMethod "$baseUrl/api/tasks"
    $taskToToggle = $tasks[0]
    $originalStatus = $taskToToggle.completed
    
    $response = Invoke-RestMethod -Method Patch -Uri "$baseUrl/api/tasks/$($taskToToggle.id)/toggle"
    
    if ($response.completed -eq $originalStatus) { 
        throw "Toggle didn't change status" 
    }
    Write-Host "   Toggled: '$($response.title)' from $originalStatus to $($response.completed)" -ForegroundColor Gray
}

# Test 11: Toggle Task Back
Test-Case "Toggle Task Back to Original" {
    $tasks = Invoke-RestMethod "$baseUrl/api/tasks"
    $taskToToggle = $tasks[0]
    
    $response = Invoke-RestMethod -Method Patch -Uri "$baseUrl/api/tasks/$($taskToToggle.id)/toggle"
    
    if ($response.completed) { 
        throw "Second toggle should have set completed to 0" 
    }
}

# Test 12: Update Task Title
Test-Case "Update Task Title" {
    $tasks = Invoke-RestMethod "$baseUrl/api/tasks"
    $taskToUpdate = $tasks[1]
    
    $body = @{ title = "Updated Task Title" } | ConvertTo-Json
    $response = Invoke-RestMethod -Method Put -Uri "$baseUrl/api/tasks/$($taskToUpdate.id)" -Body $body -ContentType "application/json"
    
    if ($response.title -ne "Updated Task Title") { 
        throw "Title not updated. Expected 'Updated Task Title', got '$($response.title)'" 
    }
    Write-Host "   Updated to: $($response.title)" -ForegroundColor Gray
}

# Test 13: Update Multiple Fields
Test-Case "Update Multiple Fields" {
    $tasks = Invoke-RestMethod "$baseUrl/api/tasks"
    $taskToUpdate = $tasks[1]
    
    $body = @{
        title = "Multi Update"
        description = "Updated description"
        completed = $true
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Method Put -Uri "$baseUrl/api/tasks/$($taskToUpdate.id)" -Body $body -ContentType "application/json"
    
    if ($response.title -ne "Multi Update") { throw "Title update failed" }
    if ($response.description -ne "Updated description") { throw "Description update failed" }
    if (-not $response.completed) { throw "Completed update failed" }
    Write-Host "   All fields updated successfully" -ForegroundColor Gray
}

# Test 14: Delete Task
Test-Case "Delete Task" {
    $tasks = Invoke-RestMethod "$baseUrl/api/tasks"
    $countBefore = $tasks.Count
    $taskToDelete = $tasks[-1]  # Last task
    
    $response = Invoke-RestMethod -Method Delete -Uri "$baseUrl/api/tasks/$($taskToDelete.id)"
    
    $tasksAfter = Invoke-RestMethod "$baseUrl/api/tasks"
    if ($tasksAfter.Count -ne ($countBefore - 1)) { 
        throw "Task count mismatch. Before: $countBefore, After: $($tasksAfter.Count)" 
    }
    Write-Host "   Deleted: $($response.deletedTask.title)" -ForegroundColor Gray
}

# Test 15: Delete Non-Existent Task
Test-Case "Delete Non-Existent Task" {
    try {
        Invoke-RestMethod -Method Delete -Uri "$baseUrl/api/tasks/non-existent-id"
        throw "Should have returned 404"
    } catch {
        if ($_.Exception.Message -notmatch "404") { 
            throw "Expected 404, got: $_" 
        }
    }
}

# Test 16: Verify Remaining Tasks
Test-Case "Verify Remaining Tasks" {
    $response = Invoke-RestMethod "$baseUrl/api/tasks"
    Write-Host "   Remaining tasks: $($response.Count)" -ForegroundColor Gray
    Write-Host "   Task list:" -ForegroundColor Gray
    $response | ForEach-Object { Write-Host "     - $($_.title) (Completed: $($_.completed))" -ForegroundColor Gray }
}

# Summary
Write-Host "`n========================`n" -ForegroundColor Cyan
Write-Host "📊 TEST RESULTS" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan
Write-Host "   Passed: $passed" -ForegroundColor Green
Write-Host "   Failed: $failed" -ForegroundColor Red
Write-Host "   Total:  $($passed + $failed)" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host "`n🎉 All tests passed! API is working perfectly!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Review the output above." -ForegroundColor Yellow
}

# Clean up test data
Write-Host "`n🧹 Cleaning up test database..." -ForegroundColor Yellow
Remove-Item tasks.db -ErrorAction SilentlyContinue
Write-Host "✅ Test database removed" -ForegroundColor Green
Write-Host "`n💡 Remember to restart your backend server!" -ForegroundColor Cyan
Write-Host "   (Ctrl+C then 'npm run dev')`n" -ForegroundColor Cyan
