import { useEffect, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { enviarCadastro } from '../lib/cadastro'
import { getSecure } from '../lib/secure'
import { setConfig, getConfig } from '../lib/db'
import { COLORS, FONTS, RADIUS } from '../constants/theme'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CadastroScreen() {
  const insets = useSafeAreaInsets()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cidade, setCidade] = useState('')
  const [aceito, setAceito] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getSecure('email').then(e => { if (e) setEmail(e) })
  }, [])

  function seguirAdiante() {
    const done = getConfig('onboarding_done')
    router.replace(done ? '/(tabs)/mapa' : '/onboarding')
  }

  async function handleConcluir() {
    const nomeTrim = nome.trim()
    const emailTrim = email.trim().toLowerCase()
    if (!nomeTrim || !emailTrim) {
      Alert.alert('Campos obrigatórios', 'Preencha nome e e-mail para continuar.')
      return
    }
    if (!EMAIL_REGEX.test(emailTrim)) {
      Alert.alert('E-mail inválido', 'Informe um endereço de e-mail válido.')
      return
    }
    if (!aceito) {
      Alert.alert('Termos de uso', 'É preciso ler e aceitar os termos para continuar.')
      return
    }

    setLoading(true)
    try {
      const result = await enviarCadastro({ nome: nomeTrim, email: emailTrim, telefone, cidade })
      if (!result.ok) {
        Alert.alert('Não foi possível concluir', result.error ?? 'Tente novamente.')
        return
      }
      setConfig('cadastro_done', '1')
      setConfig('disclaimer_accepted', '1')
      seguirAdiante()
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={[s.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Complete seu cadastro</Text>
        <Text style={s.sub}>Falta pouco — só mais um passo antes de navegar.</Text>

        <View style={s.form}>
          <Text style={s.label}>Nome</Text>
          <TextInput
            style={s.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome completo"
            placeholderTextColor={COLORS.textLight}
            autoCapitalize="words"
          />

          <Text style={s.label}>E-mail</Text>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={COLORS.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={s.label}>WhatsApp <Text style={s.opcional}>(opcional)</Text></Text>
          <TextInput
            style={s.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(21) 99999-9999"
            placeholderTextColor={COLORS.textLight}
            keyboardType="phone-pad"
          />

          <Text style={s.label}>Cidade <Text style={s.opcional}>(opcional)</Text></Text>
          <TextInput
            style={s.input}
            value={cidade}
            onChangeText={setCidade}
            placeholder="Ex: Rio de Janeiro"
            placeholderTextColor={COLORS.textLight}
            autoCapitalize="words"
          />
        </View>

        <View style={s.avisoCard}>
          <View style={s.avisoHeader}>
            <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
            <Text style={s.avisoTitulo}>Leia antes de navegar</Text>
          </View>
          <Text style={s.avisoTxt}>
            Este aplicativo é uma ferramenta de apoio à navegação e não substitui as cartas
            náuticas oficiais da Marinha do Brasil (DHN), o Aviso aos Navegantes, nem os
            equipamentos de segurança exigidos pela NORMAM-03. Use por sua conta e risco,
            respeitando sempre os limites da sua habilitação.
          </Text>
        </View>

        <TouchableOpacity
          style={s.checkRow}
          onPress={() => setAceito(v => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: aceito }}
          accessibilityLabel="Li e aceito os termos de uso e a isenção de responsabilidade"
        >
          <Ionicons name={aceito ? 'checkbox' : 'square-outline'} size={22} color={aceito ? COLORS.primary : COLORS.textLight} />
          <Text style={s.checkTxt}>Li e aceito os termos de uso e a isenção de responsabilidade acima.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.btn, loading && s.btnDisabled]}
          onPress={handleConcluir}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Concluir cadastro</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, padding: 24 },
  title: { fontSize: FONTS['2xl'], fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  sub: { fontSize: FONTS.base, color: COLORS.textMuted, marginBottom: 20, lineHeight: 20 },
  form: { gap: 4 },
  label: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  opcional: { fontWeight: '400', color: COLORS.textLight },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: FONTS.base,
    color: COLORS.text, backgroundColor: COLORS.card, marginBottom: 16,
  },
  avisoCard: {
    borderWidth: 1, borderColor: COLORS.danger, backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.md, padding: 14, gap: 8, marginTop: 4, marginBottom: 16,
  },
  avisoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avisoTitulo: { fontSize: FONTS.md, fontWeight: '800', color: COLORS.danger },
  avisoTxt: { fontSize: FONTS.sm, color: COLORS.text, lineHeight: 19 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, minHeight: 44, marginBottom: 20 },
  checkTxt: { flex: 1, fontSize: FONTS.sm, color: COLORS.text, lineHeight: 19 },
  btn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: FONTS.md, fontWeight: '700' },
})
