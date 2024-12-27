const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    
    test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Issue title',
                issue_text: 'Issue text',
                created_by: 'Created by',
                assigned_to: 'Assigned to',
                status_text: 'Status text',
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Issue title');
                assert.equal(res.body.issue_text, 'Issue text');
                assert.equal(res.body.created_by, 'Created by');
                assert.equal(res.body.assigned_to, 'Assigned to');
                assert.equal(res.body.status_text, 'Status text');
                assert.equal(res.body.open, true);
                done();
            });
    });

    test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Issue title',
                issue_text: 'Issue text',
                created_by: 'Created by',
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Issue title');
                assert.equal(res.body.issue_text, 'Issue text');
                assert.equal(res.body.created_by, 'Created by');
                assert.equal(res.body.open, true);
                done();
            });
    });

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Issue title',
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
    });

    test('View issues on a project: GET request to /api/issues/{project}', function (done) {
        chai.request(server)
            .get('/api/issues/test')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                done();
            });
    });

    test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
        chai.request(server)
            .get('/api/issues/test?created_by=Joe')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                res.body.forEach(issue => {
                    assert.equal(issue.created_by, 'Joe');
                });
                done();
            });
    });

    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
        chai.request(server)
            .get('/api/issues/test?open=true&assigned_to=Joe')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                res.body.forEach(issue => {
                    assert.equal(issue.open, true);
                    assert.equal(issue.assigned_to, 'Joe');
                });
                done();
            });
    });

    test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({
                _id: '1',
                issue_title: 'Updated title'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, '1');
                done();
            });
    });

    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({
                _id: '1',
                issue_title: 'Updated title',
                issue_text: 'Updated text'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, '1');
                done();
            });
    });

    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({
                issue_title: 'Updated title'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    });

    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({
                _id: 'valid_id'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, 'valid_id');
                done();
            });
    });

    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({
                _id: 'invalid_id',
                issue_title: 'Updated title'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body._id, 'invalid_id');
                done();
            });
    });

    test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
        chai.request(server)
            .delete('/api/issues/test')
            .send({
                _id: '1'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully deleted');
                assert.equal(res.body._id, '1');
                done();
            });
    });

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
        chai.request(server)
            .delete('/api/issues/test')
            .send({
                _id: 'invalid_id'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not delete');
                assert.equal(res.body._id, 'invalid_id');
                done();
            });
    });

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
        chai.request(server)
            .delete('/api/issues/test')
            .send({})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    });
  
});
