"use strict";

const issues = new Map();

const idGenerator = (() => {
  let _id = 0;
  return () => {
    _id++;
    return _id;
  };
})();

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let issuesForProject = Array.from(issues.values()).filter(
        (issue) => issue.project === project
      );

      res.json(issuesForProject);

      // 5. You can send a GET request to /api/issues/{projectname} for an array of all issues for that specific projectname, with all the fields present for each issue.
      // 6. You can send a GET request to /api/issues/{projectname} and filter the request by also passing along any field and value as a URL query (ie. /api/issues/{project}?open=false). You can pass one or more field/value pairs at once.
    })

    .post(function (req, res) {
      let project = req.params.project;

      let issue_title = req.query.issue_title;
      let issue_text = req.query.issue_text;
      let created_by = req.query.created_by;
      let assigned_to = req.query.assigned_to; //Optional
      let status_text = req.query.status_text; //Optional
      let created_on = new Date();
      let updated_on = new Date();
      let open = true;

      if (issue_title == "" || issue_text == "" || created_by == "") {
        res.json({ error: "required field(s) missing" });
      } else {
        const newIssue = {
          _id: idGenerator().toString(),
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
          created_on: created_on,
          updated_on: updated_on,
          open: open,
          project: project,
        };

        issues.set(newIssue._id, newIssue);
        console.log(newIssue);

        res.json(issues.get(newIssue._id));
      }

      // 3. The POST request to /api/issues/{projectname} will return the created object, and must include all of the submitted fields. Excluded optional fields will be returned as empty strings. Additionally, include created_on (date/time), updated_on (date/time), open (boolean, true for open - default value, false for closed), and _id.
      // 4. If you send a POST request to /api/issues/{projectname} without the required fields, returned will be the error { error: 'required field(s) missing' }
    })

    .put(function (req, res) {
      let project = req.params.project;

      // 7. You can send a PUT request to /api/issues/{projectname} with an _id and one or more fields to update. On success, the updated_on field should be updated, and returned should be {  result: 'successfully updated', '_id': _id }.
      // 8. When the PUT request sent to /api/issues/{projectname} does not include an _id, the return value is { error: 'missing _id' }.
      // 9. When the PUT request sent to /api/issues/{projectname} does not include update fields, the return value is { error: 'no update field(s) sent', '_id': _id }. On any other error, the return value is { error: 'could not update', '_id': _id }.
    })

    .delete(function (req, res) {
      let project = req.params.project;

      // 10. You can send a DELETE request to /api/issues/{projectname} with an _id to delete an issue. If no _id is sent, the return value is { error: 'missing _id' }. On success, the return value is { result: 'successfully deleted', '_id': _id }. On failure, the return value is { error: 'could not delete', '_id': _id }.
    });
};
