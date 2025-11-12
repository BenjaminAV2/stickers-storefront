#!/bin/bash

# Script pour configurer le webhook Medusa
# Usage: ./scripts/setup-medusa-webhook.sh

set -e

echo "============================================================"
echo "Configuration du Webhook Medusa → Next.js"
echo "============================================================"
echo ""

# Variables d'environnement
MEDUSA_API_URL="${MEDUSA_API_URL:-https://medusa-production-58da.up.railway.app}"
WEBHOOK_SECRET="${MEDUSA_WEBHOOK_SECRET:-1afEbvyKaoBCpSm1MZJ2v2pfoVJeXkLQzAcKFzCVLIU=}"

# Demander l'URL du webhook
echo "Configuration du webhook..."
echo ""
echo "Options:"
echo "  1) Développement local (http://localhost:3001)"
echo "  2) Développement avec ngrok (à spécifier)"
echo "  3) Production Vercel (à spécifier)"
echo ""
read -p "Choisissez une option (1-3): " OPTION

case $OPTION in
  1)
    WEBHOOK_URL="http://localhost:3001/api/webhooks/medusa"
    echo "⚠️  Attention: localhost ne fonctionnera que si Medusa est aussi en local"
    ;;
  2)
    read -p "URL ngrok (ex: https://abc123.ngrok.io): " NGROK_URL
    WEBHOOK_URL="${NGROK_URL}/api/webhooks/medusa"
    ;;
  3)
    read -p "URL Vercel (ex: https://your-app.vercel.app): " VERCEL_URL
    WEBHOOK_URL="${VERCEL_URL}/api/webhooks/medusa"
    ;;
  *)
    echo "❌ Option invalide"
    exit 1
    ;;
esac

echo ""
echo "URL du webhook: $WEBHOOK_URL"
echo "Secret: $WEBHOOK_SECRET"
echo ""

# Demander le token admin
read -p "Token admin Medusa (voir Railway logs ou admin Medusa): " ADMIN_TOKEN

if [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ Token admin requis"
  exit 1
fi

echo ""
echo "Création du webhook dans Medusa..."
echo ""

# Créer le webhook
RESPONSE=$(curl -s -X POST "${MEDUSA_API_URL}/admin/webhooks" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"${WEBHOOK_URL}\",
    \"events\": [
      \"order.placed\",
      \"order.updated\",
      \"order.completed\",
      \"order.canceled\",
      \"order.payment_captured\",
      \"order.fulfillment_created\",
      \"order.shipment_created\"
    ],
    \"metadata\": {
      \"description\": \"Next.js Payload CMS synchronization\",
      \"created_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
    }
  }")

# Vérifier la réponse
if echo "$RESPONSE" | grep -q "\"id\""; then
  WEBHOOK_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  echo ""
  echo "============================================================"
  echo "✅ Webhook créé avec succès!"
  echo "============================================================"
  echo ""
  echo "ID du webhook: $WEBHOOK_ID"
  echo "URL: $WEBHOOK_URL"
  echo ""
  echo "Événements configurés:"
  echo "  - order.placed"
  echo "  - order.updated"
  echo "  - order.completed"
  echo "  - order.canceled"
  echo "  - order.payment_captured"
  echo "  - order.fulfillment_created"
  echo "  - order.shipment_created"
  echo ""
  echo "Pour tester le webhook:"
  echo "  curl http://localhost:3001/api/webhooks/medusa"
  echo ""
  echo "Pour supprimer le webhook:"
  echo "  curl -X DELETE '${MEDUSA_API_URL}/admin/webhooks/${WEBHOOK_ID}' \\"
  echo "    -H 'Authorization: Bearer ${ADMIN_TOKEN}'"
  echo ""
else
  echo ""
  echo "============================================================"
  echo "❌ Erreur lors de la création du webhook"
  echo "============================================================"
  echo ""
  echo "Réponse de l'API:"
  echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
  echo ""
  echo "Vérifications:"
  echo "  1. Le token admin est-il valide?"
  echo "  2. L'API Medusa est-elle accessible?"
  echo "  3. Avez-vous les permissions admin?"
  echo ""
  exit 1
fi
