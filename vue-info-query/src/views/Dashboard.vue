<script setup lang="ts">
import { ref, watch, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElTabs, ElTabPane, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import api from '../services/api'
import type { LoginEvent, RDPEvent, ServiceInfo } from '../types/api'

const router = useRouter()
const activeTab = ref('login')
const loading = ref(false)
const tableData = ref<any[]>([])
const searchQuery = ref('')
const debugMode = ref(localStorage.getItem('debugMode') === 'true')

const toggleDebugMode = (val: boolean) => {
  localStorage.setItem('debugMode', val.toString())
  if (!val) {
    router.push('/login')
  }
}

const tabs = [
  { label: 'Client Info', name: 'client', type: 'client' },
  { label: 'Login Events', name: 'login', type: 'login' },
  { label: 'RDP Events', name: 'rdp', type: 'rdp' },
  { label: 'Services', name: 'services', type: 'service' },
  { label: 'Processes', name: 'processes', type: 'process' },
  { label: 'PowerShell', name: 'powershell', type: 'powershell' },
  { label: 'System', name: 'system', type: 'system' },
  { label: 'Application', name: 'application', type: 'application' },
  { label: 'Security', name: 'security', type: 'security' }
]

const fetchData = async () => {
  try {
    loading.value = true
    const currentTab = tabs.find(tab => tab.name === activeTab.value)
    if (!currentTab) return

    if (currentTab.type === 'client') {
      const response = await api.getClientInfo()
      tableData.value = response.clients
    } else {
      const query = searchQuery.value ? { search: searchQuery.value } : {}
      const response = await api.getEvents<any>(currentTab.type, query)
      tableData.value = response.data
    }
  } catch (error) {
    ElMessage.error('Failed to fetch data')
  } finally {
    loading.value = false
  }
}

const getColumns = () => {
  const currentTab = tabs.find(tab => tab.name === activeTab.value)
  if (!currentTab) return []

  switch(currentTab.type) {
    case 'login':
      return [
        { prop: 'EventID', label: 'Event ID', width: 100 },
        { prop: 'Username', label: 'Username' },
        { prop: 'SourceIP', label: 'Source IP' },
        { prop: 'EventTime', label: 'Time' }
      ]
    case 'rdp':
      return [
        { prop: 'ID', label: 'ID', width: 80 },
        { prop: 'LoginName', label: 'Login Name' },
        { prop: 'Address', label: 'Address' }
      ]
    case 'service':
      return [
        { prop: 'ID', label: 'ID', width: 80 },
        { prop: 'ServiceName', label: 'Service Name' },
        { prop: 'Description', label: 'Description' }
      ]
    case 'client':
      return [
        { type: 'expand' },
        { prop: 'uuid', label: 'UUID', width: 300 },
        { 
          prop: 'ip', 
          label: 'IP Addresses',
          formatter: (row: any) => row.ip.join(', ')
        },
        { 
          prop: 'SystemInfo.os_name', 
          label: 'OS Name',
          width: 200
        },
        { 
          prop: 'SystemInfo.os_version', 
          label: 'OS Version',
          width: 150
        },
        { 
          prop: 'SystemInfo.os_arch', 
          label: 'Architecture',
          width: 120
        }
      ]
    default:
      return [
        { prop: 'ID', label: 'ID', width: 80 },
        { prop: 'Description', label: 'Description' }
      ]
  }
}

const showAdvanced = ref(false)
const filters = ref([
  { key: 'clientId', label: 'Client ID', value: '', active: false },
  { key: 'uuid', label: 'UUID', value: '', active: false },
  { key: 'ip', label: 'IP Address', value: '', active: false },
  { key: 'eventId', label: 'Event ID', value: '', active: false }
])

const applyAdvancedSearch = () => {
  const activeFilters = filters.value
    .filter(f => f.active && f.value)
    .map(f => `${f.key}=${f.value}`)
  
  searchQuery.value = activeFilters.join('&')
  fetchData()
}

onMounted(fetchData)
watch(activeTab, fetchData)
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Information Dashboard</h1>
      <div class="debug-toggle">
        <el-switch
          v-model="debugMode"
          active-text="Debug Mode"
          inactive-text="Normal Mode"
          @change="toggleDebugMode"
        />
      </div>
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      >
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            placeholder="Search (clientId, uuid, ip, etc)..."
            clearable
            @change="fetchData"
          >
            <template #append>
              <el-button @click="fetchData">Search</el-button>
              <el-button @click="showAdvanced = !showAdvanced">
                {{ showAdvanced ? 'Hide' : 'Advanced' }}
              </el-button>
            </template>
          </el-input>
          
          <el-collapse-transition>
            <div v-if="showAdvanced" class="advanced-search">
              <div class="filter-grid">
                <div v-for="filter in filters" :key="filter.key" class="filter-row">
                  <el-checkbox v-model="filter.active" />
                  <span class="filter-label">{{ filter.label }}</span>
                  <el-input 
                    v-model="filter.value" 
                    :disabled="!filter.active"
                    clearable
                  />
                </div>
                <el-button 
                  type="primary" 
                  @click="applyAdvancedSearch"
                  class="apply-btn"
                >
                  Apply Filters
                </el-button>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          height="calc(100vh - 250px)"
        >
          <el-table-column
            v-for="column in getColumns()"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.search-container {
  margin: 20px 0;
}
</style>
