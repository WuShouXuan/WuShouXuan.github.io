---
layout: default
permalink: /publications/
title: "Publications"
excerpt: "Publications of Shouxuan Wu"
author_profile: true
---

{% assign journal_items = site.data.publications | where: "type", "journal" %}
{% assign conference_items = site.data.publications | where: "type", "conference" %}
{% assign working_items = site.data.publications | where: "type", "working" %}

<div class="publications-page">

  <header
    class="pub-hero"
    aria-labelledby="publications-page-title"
  >



    <h1 id="publications-page-title">
      Publications
    </h1>

    <p class="pub-hero__description">
      My current research focuses on digital thread and model-based systems
      engineering.
    </p>

    <div
      class="pub-stats"
      aria-label="Publication statistics"
    >
      <div class="pub-stat">
        <strong>{{ journal_items | size }}</strong>
        <span>Journal Papers</span>
      </div>

      <div class="pub-stat">
        <strong>{{ conference_items | size }}</strong>
        <span>Conference Papers</span>
      </div>

      <div class="pub-stat">
        <strong>{{ working_items | size }}</strong>
        <span>Working Papers</span>
      </div>
    </div>
  </header>

  <nav
    class="pub-jump-nav"
    aria-label="Publication sections"
  >
    <a href="#journal-papers">
      Journal Papers
    </a>

    <a href="#conference-papers">
      Conference Papers
    </a>

    <a href="#working-papers">
      Working Papers
    </a>
  </nav>

  <p class="pub-author-note">
    <strong>Wu S</strong> denotes Shouxuan Wu.
    Author roles and indexing information are displayed using a unified
    deep-blue label style.
  </p>

{% include publication-list.html section_id="journal-papers"  title="Journal Papers" items=journal_items %}

{% include publication-list.html section_id="conference-papers"  title="Conference Papers" items=conference_items %}

{% include publication-list.html section_id="working-papers"  title="Working Papers" items=working_items %}

</div>