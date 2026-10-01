# SLA: Simple Location App

A lightweight, zero-backend GitHub Pages utility that requests browser geolocation permission, copies latitude/longitude to the clipboard, and optionally returns the visitor to a form.

## GitHub Pages
Enable GitHub Pages for the `main` branch and repository root.

## Usage
Normal: `https://ianmkinney.github.io/sla/`

Return to a form afterward:
`https://ianmkinney.github.io/sla/?return=ENCODED_HTTPS_FORM_URL`

## Privacy
Coordinates are processed entirely in the visitor's browser. This app has no backend and does not store or transmit the coordinates itself.


## Purpose

Simple Location App is a private, browser-based location utility for a Joro spider collection form. It reads a visitor’s current coordinates only in their browser so they can copy and paste them into the form. Location data is not stored, transmitted, or shared by this app.
