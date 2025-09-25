document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('projects-list');
  if (!list) return;

  const showError = (message) => {
    list.innerHTML = '';
    const err = document.createElement('p');
    err.className = 'muted';
    err.textContent = message;
    list.appendChild(err);
  };

  const renderProjects = (projects) => {
    list.innerHTML = '';
    projects.forEach((project) => {
      const card = document.createElement('article');
      card.className = 'card';

      if (project.image) {
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title || '';
        card.appendChild(img);
      }

      const body = document.createElement('div');
      body.className = 'card-body';

      const heading = document.createElement('h2');
      const link = document.createElement('a');
      link.href = `/projects/${project.slug}/`;
      link.textContent = project.title || 'Untitled project';
      heading.appendChild(link);
      body.appendChild(heading);

      if (project.summary) {
        const summary = document.createElement('p');
        summary.textContent = project.summary;
        body.appendChild(summary);
      }

      if (Array.isArray(project.tags) && project.tags.length) {
        const tags = document.createElement('div');
        tags.className = 'tags';
        project.tags.forEach((tagValue) => {
          const tag = document.createElement('span');
          tag.textContent = tagValue;
          tags.appendChild(tag);
        });
        body.appendChild(tags);
      }

      const actions = document.createElement('div');
      actions.className = 'card-actions';

      const view = document.createElement('a');
      view.href = `/projects/${project.slug}/`;
      view.className = 'btn';
      view.textContent = 'View project';
      actions.appendChild(view);

      if (project.links) {
        if (project.links.demo) {
          const demo = document.createElement('a');
          demo.href = project.links.demo;
          demo.className = 'btn subtle';
          demo.textContent = 'Demo';
          demo.target = '_blank';
          demo.rel = 'noopener noreferrer';
          actions.appendChild(demo);
        }
        if (project.links.repo) {
          const repo = document.createElement('a');
          repo.href = project.links.repo;
          repo.className = 'btn subtle';
          repo.textContent = 'Source';
          repo.target = '_blank';
          repo.rel = 'noopener noreferrer';
          actions.appendChild(repo);
        }
      }

      body.appendChild(actions);
      card.appendChild(body);
      list.appendChild(card);
    });
  };

  fetch('/data/projects.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load projects: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error('Project data is not an array');
      }
      renderProjects(data);
    })
    .catch((error) => {
      console.error(error);
      showError('Unable to load projects right now.');
    });
});
