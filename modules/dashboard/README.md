##Dashboard

| URL                                   | Description                       | Response  |
| ------------------------------------- |:----------------------------------| ----------|
| GET: /dashboard                       | Renders the main dashboard view   | 200 html  |
| GET: /dashboard/partials/standardView | standard dashboard layout         | 200 html  |
| GET: /dashboard/partials/cardView     | card dashboard layout             | 200 html  |
| GET: /dashboard/partials/feedView     | feed dashboard layout             | 200 html  |
| GET: /dashboard/partials/gridView     | grid dashboard layout             | 200 html  |
| GET: /dashboard/partials/userGuide    | user guide view                   | 200 html  |
| GET: /dashboard/partials/settings     | user settings view                | 200 html  |
| GET: /dashboard/user/:user            | user dashboard data               | 200 user json populated with all values |
