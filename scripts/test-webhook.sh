#!/bin/bash

# Script pour tester le webhook Medusa en local
# Usage: ./scripts/test-webhook.sh

set -e

echo "============================================================"
echo "Test du Webhook Medusa"
echo "============================================================"
echo ""

WEBHOOK_URL="${1:-http://localhost:3001/api/webhooks/medusa}"
WEBHOOK_SECRET="${MEDUSA_WEBHOOK_SECRET:-1afEbvyKaoBCpSm1MZJ2v2pfoVJeXkLQzAcKFzCVLIU=}"

echo "URL du webhook: $WEBHOOK_URL"
echo ""

# Test 1: Vérifier que l'endpoint est actif
echo "Test 1: Vérification de l'endpoint (GET)..."
RESPONSE=$(curl -s "$WEBHOOK_URL")
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 2: Simuler un événement order.placed
echo "Test 2: Simulation d'un événement order.placed..."
RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "x-medusa-signature: ${WEBHOOK_SECRET}" \
  -d '{
    "event": "order.placed",
    "data": {
      "id": "order_test_123456",
      "status": "pending",
      "email": "test@example.com",
      "customer_id": "cus_test",
      "currency_code": "eur",
      "total": 5000,
      "subtotal": 4000,
      "tax_total": 800,
      "shipping_total": 500,
      "discount_total": 300,
      "created_at": "2025-11-12T15:00:00Z",
      "updated_at": "2025-11-12T15:00:00Z",
      "items": [
        {
          "id": "item_1",
          "title": "Sticker Holographique",
          "quantity": 2,
          "unit_price": 2000,
          "total": 4000
        }
      ],
      "shipping_address": {
        "first_name": "Jean",
        "last_name": "Dupont",
        "address_1": "123 Rue de Test",
        "city": "Paris",
        "postal_code": "75001",
        "country_code": "FR"
      }
    }
  }')

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 3: Simuler un événement order.updated
echo "Test 3: Simulation d'un événement order.updated..."
RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "x-medusa-signature: ${WEBHOOK_SECRET}" \
  -d '{
    "event": "order.updated",
    "data": {
      "id": "order_test_123456",
      "status": "completed"
    }
  }')

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

echo "============================================================"
echo "Tests terminés"
echo "============================================================"
echo ""
echo "Vérifiez les logs du serveur Next.js pour voir les résultats"
echo "Vérifiez dans Payload CMS si les commandes ont été créées:"
echo "  http://localhost:3001/admin/collections/orders"
echo ""
