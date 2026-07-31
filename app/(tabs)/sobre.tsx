import { useState } from 'react'
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Constants from 'expo-constants'
import { COLORS, FONTS, RADIUS } from '../../constants/theme'
import { getConfig, setConfig } from '../../lib/db'

const APP_VERSION = Constants.expoConfig?.version ?? '1.0'

export default function SobreScreen() {
  const insets = useSafeAreaInsets()
  const [aceito, setAceito] = useState(getConfig('disclaimer_accepted') === '1')

  function aceitarDisclaimer() {
    setConfig('disclaimer_accepted', '1')
    setAceito(true)
    router.replace('/(tabs)/mapa')
  }

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={[s.container, { paddingBottom: insets.bottom + 40 }]}
    >
      <View style={s.heroBox}>
        <Image
          source={require('../../assets/logo.png')}
          style={s.logoImg}
          resizeMode="contain"
          accessibilityLabel="Logo Rota Náutica"
        />
        <View style={s.appInfo}>
          <Text style={s.appNome}>Rota Náutica</Text>
          <View style={s.badgeRow}>
            <View style={s.badge}><Text style={s.badgeTxt}>PRO</Text></View>
            <Text style={s.version}>v{APP_VERSION}</Text>
          </View>
        </View>
      </View>

      <View style={[s.card, s.avisoCard]}>
        <View style={s.avisoHeader}>
          <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
          <Text style={s.avisoTitulo}>Leia antes de navegar</Text>
        </View>
        <Text style={s.avisoTxt}>
          Este aplicativo é uma ferramenta de apoio à navegação e não substitui as cartas
          náuticas oficiais da Marinha do Brasil (DHN), o Aviso aos Navegantes, nem os
          equipamentos de segurança e navegação exigidos pela NORMAM-03. Use por sua conta
          e risco e sempre respeite os limites da sua habilitação: Arrais-Amador (águas
          interiores/lacustres) ou Mestre-Amador (até 20 milhas náuticas da costa). O app
          não valida nem impõe esses limites — a responsabilidade é do operador.
        </Text>
        <Text style={s.avisoTxt}>
          Dados de batimetria não devem ser usados para navegação ou qualquer finalidade
          relacionada à segurança no mar.
        </Text>
      </View>

      <Text style={s.sectionTitle}>Atribuições</Text>
      <View style={s.card}>
        <Text style={s.cardDesc}>
          Dados de mapa © colaboradores do OpenStreetMap (licença ODbL).{'\n'}
          Marcas náuticas: © OpenSeaMap contributors (CC-BY-SA 2.0).{'\n'}
          Batimetria: Imagery reproduced from the GEBCO Grid, www.gebco.net.
        </Text>
      </View>

      {!aceito && (
        <TouchableOpacity style={s.aceitarBtn} onPress={aceitarDisclaimer} accessibilityRole="button" accessibilityLabel="Eu entendo e aceito">
          <Text style={s.aceitarTxt}>Eu entendo e aceito</Text>
        </TouchableOpacity>
      )}

      <Text style={s.sectionTitle}>Diferenciais</Text>
      <View style={s.card}>
        {[
          { icone: 'locate-outline' as const, txt: 'Posição GPS em tempo real sobre a carta' },
          { icone: 'navigate-outline' as const, txt: 'Planejamento de rotas e waypoints' },
          { icone: 'cloud-download-outline' as const, txt: 'Áreas offline para navegar sem sinal' },
          { icone: 'warning-outline' as const, txt: 'Alerta de Homem ao Mar em 1 toque' },
          { icone: 'lock-closed-outline' as const, txt: 'Seus dados no seu aparelho — privacidade total' },
        ].map((item, i) => (
          <View key={i} style={s.difRow}>
            <Ionicons name={item.icone} size={18} color={COLORS.primary} />
            <Text style={s.difTxt}>{item.txt}</Text>
          </View>
        ))}
      </View>

      <Text style={s.sectionTitle}>Suporte</Text>
      <View style={s.card}>
        <TouchableOpacity
          style={s.suporteBtn}
          onPress={() => Linking.openURL('https://wa.me/5561XXXXXXXXX?text=Suporte%20Rota%20N%C3%A1utica')}
          accessibilityRole="button"
          accessibilityLabel="Abrir WhatsApp para suporte"
        >
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          <Text style={s.suporteTxt}>Suporte via WhatsApp</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <Text style={s.footerTxt}>Rota Náutica</Text>
        <Text style={s.footerSub}>
          Ferramenta de apoio à navegação — não substitui{'\n'}cartas náuticas oficiais nem itens de segurança.
        </Text>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 16, gap: 12 },

  heroBox: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  logoImg: { width: 72, height: 72 },
  appInfo: { alignItems: 'center' },
  appNome: { fontSize: FONTS.xl, fontWeight: '800', color: COLORS.text },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeTxt: { fontSize: FONTS.xs, fontWeight: '700', color: COLORS.primaryDark },
  version: { fontSize: FONTS.xs, color: COLORS.textLight },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 10,
  },
  avisoCard: { borderColor: COLORS.danger, backgroundColor: COLORS.dangerLight },
  avisoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avisoTitulo: { fontSize: FONTS.md, fontWeight: '800', color: COLORS.danger },
  avisoTxt: { fontSize: FONTS.sm, color: COLORS.text, lineHeight: 20 },
  cardDesc: { fontSize: FONTS.sm, color: COLORS.textMuted, lineHeight: 20 },

  sectionTitle: {
    fontSize: FONTS.base,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 4,
  },

  aceitarBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  aceitarTxt: { color: '#fff', fontSize: FONTS.md, fontWeight: '700' },

  difRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  difTxt: { flex: 1, fontSize: FONTS.sm, color: COLORS.text },

  suporteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    minHeight: 44,
  },
  suporteTxt: { flex: 1, fontSize: FONTS.base, color: COLORS.text, fontWeight: '600' },

  footer: { alignItems: 'center', marginTop: 8, gap: 6 },
  footerTxt: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textMuted },
  footerSub: { fontSize: FONTS.xs, color: COLORS.textLight, textAlign: 'center', lineHeight: 16 },
})
