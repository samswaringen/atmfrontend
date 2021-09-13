import React from 'react'
import HandleHistory from './HandleHistory'
import Card from 'react-bootstrap/Card'

function AccountHistory() {
    return (
        <Card key = 'history' id = 'history'>
            <h3 id = "history-title">Account History</h3>
            <ul id="history-list">
                { <HandleHistory />}
            </ul>
        </Card>
    )
}

export default AccountHistory
