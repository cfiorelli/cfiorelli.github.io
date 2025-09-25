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
      card.className = 'card project-card';

      if (project.image) {
        const media = document.createElement('div');
        media.className = 'card-media';

        const img = document.createElement('img');
        img.src = project.image;
        if (project.image2x) {
          img.srcset = `${project.image} 1x, ${project.image2x} 2x`;
        }
        img.alt = project.imageAlt || project.title || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        media.appendChild(img);
        card.appendChild(media);
      }

      const body = document.createElement('div');
      body.className = 'card-body';

      const links = project.links || {};
      const caseStudyUrl = links.caseStudy || `/projects/${project.slug}/`;

      const heading = document.createElement('h2');
      const link = document.createElement('a');
      link.href = caseStudyUrl;
      link.textContent = project.title || 'Untitled project';
      if (/^https?:/.test(caseStudyUrl)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      heading.appendChild(link);
      body.appendChild(heading);

      if (project.status) {
        const percent = typeof project.status.percent === 'number' ? project.status.percent : 0;
        const label = project.status.label || '';
        const status = document.createElement('div');
        status.className = 'project-status';
        if (project.status.note) {
          status.title = project.status.note;
        }
        const ariaLabel = [`${percent}% complete`, label ? `— ${label}` : ''].join(' ').trim();
        status.setAttribute('aria-label', ariaLabel);

        const percentEl = document.createElement('span');
        percentEl.className = 'project-status__percent';
        percentEl.textContent = `${percent}%`;
        status.appendChild(percentEl);

        if (label) {
          const labelEl = document.createElement('span');
          labelEl.className = 'project-status__label';
          labelEl.textContent = label;
          status.appendChild(labelEl);
        }

        body.appendChild(status);
      }

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
      view.href = caseStudyUrl;
      view.className = 'btn';
      view.textContent = 'Project page';
      if (/^https?:/.test(caseStudyUrl)) {
        view.target = '_blank';
        view.rel = 'noopener noreferrer';
      }
      actions.appendChild(view);

      if (links.repo) {
        const repo = document.createElement('a');
        repo.href = links.repo;
        repo.className = 'btn ghost';
        repo.textContent = 'Source';
        repo.target = '_blank';
        repo.rel = 'noopener noreferrer';
        actions.appendChild(repo);
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
