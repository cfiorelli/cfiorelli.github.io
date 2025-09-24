document.getElementById('send').addEventListener('click', ()=>{
  const q = document.getElementById('q').value.trim();
  const chat = document.getElementById('chat');
  const code = document.getElementById('code');
  if(!q) return;
  // Mocked behavior: if user asks for arXiv id, return a short summary and code snippet
  if(q.match(/2301\.10140/)){
    chat.textContent = 'Summary: The Semantic Scholar Open Data Platform describes an open dataset and APIs for research discovery.';
    code.textContent = `# Python example: fetch paper metadata\nimport requests\nresp = requests.get('https://api.semanticscholar.org/graph/v1/paper/arXiv:2301.10140?fields=title,authors,year,abstract')\nprint(resp.json())\n\n# curl example\ncurl 'https://api.semanticscholar.org/graph/v1/paper/arXiv:2301.10140?fields=title,authors,year,abstract'`;
  } else if(q.toLowerCase().includes('code')){
    chat.textContent = 'I can generate example API calls; ask for a language (python, javascript, curl).';
    code.textContent = '# Example: curl request to Semantic Scholar API\ncurl "https://api.semanticscholar.org/graph/v1/paper/search?query=deep+learning"';
  } else {
    chat.textContent = 'Mock assistant: Sorry, this demo returns canned responses. Try "summarize arXiv:2301.10140" or ask for "code".';
    code.textContent = '';
  }
});
