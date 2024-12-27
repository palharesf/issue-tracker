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

      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on,
        updated_on,
        open,
        _id,
      } = req.query;

      let filter = {};
      if (issue_title) filter.issue_title = issue_title;
      if (issue_text) filter.issue_text = issue_text;
      if (created_by) filter.created_by = created_by;
      if (assigned_to) filter.assigned_to = assigned_to;
      if (status_text) filter.status_text = status_text;
      if (created_on) filter.created_on = created_on;
      if (updated_on) filter.updated_on = updated_on;
      if (open != null) filter.open = open;
      if (_id) filter._id = _id;

      let issuesForProject = Array.from(issues.values())
        .filter(
          (issue) =>
            issue.project === project &&
            Object.keys(filter).every((key) => issue[key] === filter[key])
        )
        .map((issue) => {
          let { project, ...otherFields } = issue;
          return otherFields;
        });

      res.json(issuesForProject);
    })

    .post(function (req, res) {
      let project = req.params.project;

      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to; //Optional
      let status_text = req.body.status_text; //Optional
      let created_on = new Date();
      let updated_on = new Date();
      let open = true;

      if (
        typeof issue_title === "undefined" ||
        typeof issue_text === "undefined" ||
        typeof created_by === "undefined"
      ) {
        res.json({ error: "required field(s) missing" });
      } else {
        const newIssue = {
          issue_title: issue_title ? issue_title.toString() : "",
          issue_text: issue_text ? issue_text.toString() : "",
          created_by: created_by ? created_by.toString() : "",
          assigned_to: assigned_to ? assigned_to.toString() : "",
          status_text: status_text ? status_text.toString() : "",
          created_on,
          updated_on,
          open,
          _id: idGenerator().toString(),
          project: project ? project.toString() : "",
        };

        issues.set(newIssue._id, newIssue);

        res.json({
          assigned_to,
          status_text,
          open,
          _id: newIssue._id,
          issue_title,
          issue_text,
          created_by,
          created_on,
          updated_on,
        });
      }

      // 3. The POST request to /api/issues/{projectname} will return the created object, and must include all of the submitted fields. Excluded optional fields will be returned as empty strings. Additionally, include created_on (date/time), updated_on (date/time), open (boolean, true for open - default value, false for closed), and _id.
    })

    .put(function (req, res) {
      let project = req.params.project;

      const { _id, ...fields } = req.body;

      if (typeof _id == "undefined") {
        res.json({ error: "missing _id" });
      } else if (Object.keys(fields).length === 0) {
        res.json({ error: "no update field(s) sent", _id: _id });
      } else if (!issues.has(_id)) {
        res.json({ error: "could not update", _id: _id });
      } else {
        let issue = issues.get(_id);
        issues.set(_id, { ...issue, ...fields, updated_on: new Date() });
        res.json({ result: "successfully updated", _id });
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;

      const { _id } = req.body;

      if (typeof _id == "undefined") {
        res.json({ error: "missing _id" });
      } else if (!issues.has(_id)) {
        res.json({ error: "could not delete", _id: _id });
      } else {
        issues.delete(_id);
        res.json({ result: "successfully deleted", _id });
      }
    });
};
