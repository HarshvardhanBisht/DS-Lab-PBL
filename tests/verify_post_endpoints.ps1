$postTests = @(
    @{ name = 'Advance Simulation Time'; url = 'http://127.0.0.1:8080/api/simulation/advance'; body = '{"minutes":15}' },
    @{ name = 'Trigger Dynamic Rehash'; url = 'http://127.0.0.1:8080/api/ds/hash-table/rehash'; body = '' },
    @{ name = 'Extract Max Heap'; url = 'http://127.0.0.1:8080/api/ds/priority-queue/extract-max'; body = '' },
    @{ name = 'Knapsack Cargo Loader'; url = 'http://127.0.0.1:8080/api/resources/knapsack'; body = '{"capacityKg":500}' },
    @{ name = '2-Opt Delivery Route'; url = 'http://127.0.0.1:8080/api/resources/route2opt'; body = '' },
    @{ name = 'Toggle Road Block'; url = 'http://127.0.0.1:8080/api/roads/toggle'; body = '{"from":"JIIT Sector 62","to":"Mamura Village","blocked":true}' },
    @{ name = 'Dispatch Next'; url = 'http://127.0.0.1:8080/api/dispatch/next'; body = '' },
    @{ name = 'Undo Action'; url = 'http://127.0.0.1:8080/api/undo'; body = '' }
)

$passed = 0
foreach ($t in $postTests) {
    try {
        if ($t.body -ne '') {
            $res = Invoke-RestMethod -Uri $t.url -Method Post -Body $t.body -ContentType 'application/json'
        } else {
            $res = Invoke-RestMethod -Uri $t.url -Method Post
        }
        Write-Host ("[PASS] " + $t.name) -ForegroundColor Green
        $passed++
    } catch {
        Write-Host ("[FAIL] " + $t.name + " (" + $_.Exception.Message + ")") -ForegroundColor Red
    }
}
Write-Host "========================================="
Write-Host ("Total POST Endpoints Verified: " + $passed + " / " + $postTests.Count)
