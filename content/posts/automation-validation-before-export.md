---
title: "Why extracted document fields need a review step"
excerpt: "A plausible invoice total can still be wrong. Check required fields and arithmetic, then compare the output with its source before exporting."
date: "2026-10-01"
intentKey: "invoice-validation"
keywords: ["invoice extraction validation", "document review before export"]
status: published
reviewed: true
tags: ["Automation", "Workflow", "Documents"]
---

Extraction turns document content into fields. It does not establish that those fields are correct or that the document is genuine. Validation and review are separate parts of the workflow.

## Make incomplete records visible

Define the required fields before choosing an extraction tool. In BuildZn’s [sample invoice demonstration](/work/document-processing), those fields include supplier, invoice number, date, currency and amounts. Missing fields block export.

The example is a browser-based text parser for a labeled sample format. It does not perform OCR or read arbitrary PDFs. A production extractor needs evaluation on representative documents, including poor scans and unfamiliar layouts.

## Check relationships between fields

A number can look valid while contradicting another field. The demonstration checks that subtotal plus tax equals total. This is a narrow rule for the sample invoice; a real accounting workflow may need discounts, multiple tax rates, rounding rules, purchase-order matching and duplicate checks.

Do not silently “fix” a document to make validation pass. Show the original and the extracted values so a reviewer can decide what to correct.

## Reset approval when values change

Review applies to a particular version of the extracted record. If an amount changes, the approval needs to be cleared. Otherwise a previously reviewed output could be replaced before export without another check.

The sample demonstration follows this rule. CSV and JSON export require passing validation and a checked review confirmation. No accounting system is connected.

## Define the production boundary

Secure document storage, permissions, extraction costs and accounting access need their own implementation scope. Posting a transaction has different consequences from preparing a downloadable record. Agree which actions require approval before building the connection.
