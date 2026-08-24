import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Button,
  CircularProgress,
  Stack,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Alert,
  Avatar,
  Paper
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";

const POPULAR_COMPANIES = ["Google", "Microsoft", "Amazon", "Meta", "TCS", "Infosys", "Wipro"];

// --- Comprehensive Filter Mappings ---

const ROLE_MAPPINGS = {
  "Software Developer": [
    "software",
    "software developer",
    "software engineer",
    "sde",
    "programmer",
    "developer",
    "full stack",
    "fullstack",
    "web dev"
  ],
  "ML Engineer": [
    "ml",
    "machine learning",
    "ai",
    "artificial intelligence",
    "deep learning",
    "nlp",
    "computer vision",
    "data engineer"
  ],
  "Data Scientist": [
    "data science",
    "data scientist",
    "data analyst",
    "analytics",
    "bi analyst"
  ],
  "Frontend Developer": [
    "frontend",
    "front end",
    "react",
    "angular",
    "vue",
    "ui developer",
    "javascript developer",
    "nextjs"
  ],
  "Backend Developer": [
    "backend",
    "back end",
    "node",
    "nodejs",
    "django",
    "flask",
    "spring boot",
    "java developer",
    "golang",
    "python developer"
  ]
};

const LOCATION_MAPPINGS = {
  Noida: ["noida", "greater noida", "sector 62", "sector 125"],
  Bangalore: ["bangalore", "bengaluru", "whitefield", "electronic city", "koramangala", "bellandur"],
  Hyderabad: ["hyderabad", "cyberabad", "hitec city", "gachibowli", "madhapur"],
  Pune: ["pune", "hinjewadi", "magarpatta", "kharadi"],
  "Delhi NCR": ["delhi", "ncr", "gurgaon", "gurugram", "faridabad", "ghaziabad"]
};

const JOB_TYPE_MAPPINGS = {
  Internship: ["intern", "internship", "trainee", "summer intern", "winter intern"],
  "Full-time": ["full time", "full-time", "fulltime", "permanent", "fte"],
  "Part-time": ["part time", "part-time", "parttime"],
  Contractor: ["contract", "contractor", "freelance", "freelancer", "consultant"]
};

const WORK_TYPE_MAPPINGS = {
  Remote: ["remote", "work from home", "wfh", "virtual", "anywhere", "online work"],
  Hybrid: ["hybrid", "flexible", "hybrid work"],
  "In Office": ["in office", "in-office", "onsite", "on-site", "office"]
};

const EXPERIENCE_MAPPINGS = {
  Fresher: ["fresher", "freshers", "entry level", "entry-level", "graduate", "0 years", "0-1 year", "no experience", "batch of 2024", "batch of 2025", "batch of 2026"],
  "1-2 years": ["1-2 years", "1 year", "2 years", "junior", "1 to 2 years", "1+ year"],
  "3-5 years": ["3-5 years", "3 years", "4 years", "5 years", "mid level", "mid-level", "3 to 5 years"],
  "5+ years": ["5+ years", "senior", "lead", "staff", "principal", "architect", "5 to 10 years", "10+ years"]
};

const JOINING_MAPPINGS = {
  Immediate: ["immediate", "immediately", "immediate joiner", "instant", "asap", "urgent hiring", "join immediately"],
  "Within 1 Month": ["1 month", "30 days", "within 1 month", "15 days", "notice period 1 month"],
  "Within 2 Months": ["2 months", "60 days", "within 2 months", "2 month notice"]
};

// Multi-Source Search Query Resolver
const getSearchQuery = (props) => {
  if (props?.searchData?.query) return props.searchData.query;
  if (props?.searchData?.searchQuery) return props.searchData.searchQuery;
  if (props?.query) return props.query;
  if (props?.searchQuery) return props.searchQuery;

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get("q") || params.get("query") || params.get("search");
    if (urlQuery) return urlQuery;

    if (window.location.hash.includes("?")) {
      const hashParams = new URLSearchParams(window.location.hash.split("?")[1]);
      const hashQuery = hashParams.get("q") || hashParams.get("query");
      if (hashQuery) return hashQuery;
    }
  }

  return "";
};

// Smart Query Parser
const parseQueryToFilters = (incomingQuery = "") => {
  const queryLower = incomingQuery.toLowerCase();

  // 1. Role Parsing
  let detectedRole = "Any";
  let customRoleVal = "";
  for (const [roleName, keywords] of Object.entries(ROLE_MAPPINGS)) {
    if (keywords.some((kw) => queryLower.includes(kw))) {
      detectedRole = roleName;
      break;
    }
  }

  // 2. Location Parsing
  let detectedLocation = "Any";
  let customLocationVal = "";
  for (const [locName, keywords] of Object.entries(LOCATION_MAPPINGS)) {
    if (keywords.some((kw) => queryLower.includes(kw))) {
      detectedLocation = locName;
      break;
    }
  }

  // 3. Job Type Parsing
  let detectedJobType = "Any";
  for (const [jobType, keywords] of Object.entries(JOB_TYPE_MAPPINGS)) {
    if (keywords.some((kw) => queryLower.includes(kw))) {
      detectedJobType = jobType;
      break;
    }
  }

  // 4. Work Model Parsing
  let detectedWorkType = "Any";
  for (const [workType, keywords] of Object.entries(WORK_TYPE_MAPPINGS)) {
    if (keywords.some((kw) => queryLower.includes(kw))) {
      detectedWorkType = workType;
      break;
    }
  }

  // 5. Experience Parsing
  let detectedExperience = "Any";
  for (const [expLevel, keywords] of Object.entries(EXPERIENCE_MAPPINGS)) {
    if (keywords.some((kw) => queryLower.includes(kw))) {
      detectedExperience = expLevel;
      break;
    }
  }

  // 6. Joining Timeline Parsing
  let detectedJoining = "Any";
  for (const [joinPeriod, keywords] of Object.entries(JOINING_MAPPINGS)) {
    if (keywords.some((kw) => queryLower.includes(kw))) {
      detectedJoining = joinPeriod;
      break;
    }
  }

  // 7. Specific Company Detection
  const matchedCompanies = [];
  for (const comp of POPULAR_COMPANIES) {
    if (queryLower.includes(comp.toLowerCase())) {
      matchedCompanies.push(comp);
    }
  }

  const companyMode = matchedCompanies.length > 0 ? "specific" : "all";

  // 8. Custom Fallback
  if (detectedRole === "Any" && incomingQuery.trim()) {
    const cleanedRole = incomingQuery
      .replace(/\b(jobs?|hiring|vacanc(y|ies)|openings?|careers?|work|find|search|in|at|for|near|remote|hybrid|fresher|immediate|internship|full time|part time)\b/gi, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim();

    if (cleanedRole.length > 2 && detectedLocation === "Any") {
      detectedRole = "Custom";
      customRoleVal = cleanedRole;
    }
  }

  return {
    role: detectedRole,
    customRole: customRoleVal,
    location: detectedLocation,
    customLocation: customLocationVal,
    jobType: detectedJobType,
    workType: detectedWorkType,
    experience: detectedExperience,
    joining: detectedJoining,
    companyMode,
    selectedCompanies: matchedCompanies
  };
};

export default function NewComponent(props) {
  const rawQuery = getSearchQuery(props);
  const initialFilters = parseQueryToFilters(rawQuery);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompanyToggle = (company) => {
    setFilters((prev) => {
      const current = prev.selectedCompanies;
      const exists = current.includes(company);
      return {
        ...prev,
        selectedCompanies: exists ? current.filter((c) => c !== company) : [...current, company]
      };
    });
  };

  const constructQuery = (currentFilters = filters) => {
    const queryParts = [];

    // Role
    if (currentFilters.role === "Custom" && currentFilters.customRole.trim()) {
      queryParts.push(currentFilters.customRole.trim());
    } else if (currentFilters.role !== "Any") {
      queryParts.push(currentFilters.role);
    } else {
      queryParts.push("developer jobs");
    }

    // Job Type & Work Model
    if (currentFilters.jobType !== "Any") queryParts.push(currentFilters.jobType);
    if (currentFilters.workType !== "Any") queryParts.push(currentFilters.workType);
    if (currentFilters.experience !== "Any") queryParts.push(currentFilters.experience);
    if (currentFilters.joining !== "Any") queryParts.push(`${currentFilters.joining} joining`);

    // Target Companies
    if (currentFilters.companyMode === "specific" && currentFilters.selectedCompanies.length > 0) {
      queryParts.push(`(${currentFilters.selectedCompanies.join(" OR ")})`);
    }

    return queryParts.filter(Boolean).join(" ");
  };

  const fetchJobs = async (overrideFilters = null) => {
    setLoading(true);
    setErrorMsg("");

    const activeFilters = overrideFilters || filters;
    const query = constructQuery(activeFilters);

    let locationVal = "India";
    if (activeFilters.location === "Custom" && activeFilters.customLocation.trim()) {
      locationVal = activeFilters.customLocation.trim();
    } else if (activeFilters.location !== "Any") {
      locationVal = activeFilters.location;
    }

    const endpoint = `http://localhost:5000/api/jobs?q=${encodeURIComponent(
      query
    )}&location=${encodeURIComponent(locationVal)}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Server status: ${res.status}`);
      const data = await res.json();

      if (data.error) {
        setErrorMsg(data.error);
        setJobs([]);
      } else {
        setJobs(data.jobs_results || []);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setErrorMsg("Cannot connect to local proxy (http://localhost:5000). Ensure 'node proxy.js' is running.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs(initialFilters);
  }, []);

  // Update when parent query changes
  useEffect(() => {
    const currentQuery = getSearchQuery(props);
    if (currentQuery) {
      const updatedFilters = parseQueryToFilters(currentQuery);
      setFilters(updatedFilters);
      fetchJobs(updatedFilters);
    }
  }, [props, props?.searchData]);

  // Lifecycle callback to parent platform
  useEffect(() => {
    if (!hasLoadedInitial && !loading) {
      props?.messageHandlers?.componentLoaded?.();
      setHasLoadedInitial(true);
    }
  }, [loading, hasLoadedInitial, props]);

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2.5, color: "#0f172a" }}>
        Job Search
      </Typography>

      {/* Top Filter Bar */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 3,
          bgcolor: "#ffffff",
          borderRadius: 2,
          borderColor: "#e2e8f0"
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Role */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Role / Domain"
              size="small"
              fullWidth
              value={filters.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
            >
              <MenuItem value="Any">Any Role</MenuItem>
              <MenuItem value="Software Developer">Software Developer</MenuItem>
              <MenuItem value="ML Engineer">Machine Learning Engineer</MenuItem>
              <MenuItem value="Data Scientist">Data Scientist</MenuItem>
              <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
              <MenuItem value="Backend Developer">Backend Developer</MenuItem>
              <MenuItem value="Custom">Custom Role...</MenuItem>
            </TextField>
          </Grid>

          {/* Location */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Location"
              size="small"
              fullWidth
              value={filters.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            >
              <MenuItem value="Any">Any Location (India)</MenuItem>
              <MenuItem value="Noida">Noida</MenuItem>
              <MenuItem value="Bangalore">Bangalore</MenuItem>
              <MenuItem value="Hyderabad">Hyderabad</MenuItem>
              <MenuItem value="Pune">Pune</MenuItem>
              <MenuItem value="Delhi NCR">Delhi NCR</MenuItem>
              <MenuItem value="Custom">Custom Location...</MenuItem>
            </TextField>
          </Grid>

          {/* Job Type */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Job Type"
              size="small"
              fullWidth
              value={filters.jobType}
              onChange={(e) => handleInputChange("jobType", e.target.value)}
            >
              <MenuItem value="Any">Any Type</MenuItem>
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contractor">Freelance / Contract</MenuItem>
            </TextField>
          </Grid>

          {/* Work Model */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Work Model"
              size="small"
              fullWidth
              value={filters.workType}
              onChange={(e) => handleInputChange("workType", e.target.value)}
            >
              <MenuItem value="Any">Any Model</MenuItem>
              <MenuItem value="In Office">In Office</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
            </TextField>
          </Grid>

          {/* Experience */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Experience"
              size="small"
              fullWidth
              value={filters.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
            >
              <MenuItem value="Any">Any Experience</MenuItem>
              <MenuItem value="Fresher">Fresher / Entry</MenuItem>
              <MenuItem value="1-2 years">1-2 Years</MenuItem>
              <MenuItem value="3-5 years">3-5 Years</MenuItem>
              <MenuItem value="5+ years">Senior (5+ Years)</MenuItem>
            </TextField>
          </Grid>

          {/* Custom Role Input */}
          {filters.role === "Custom" && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Enter Custom Role"
                size="small"
                fullWidth
                value={filters.customRole}
                onChange={(e) => handleInputChange("customRole", e.target.value)}
                placeholder="e.g. Cloud Architect"
              />
            </Grid>
          )}

          {/* Custom Location Input */}
          {filters.location === "Custom" && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Enter Custom Location"
                size="small"
                fullWidth
                value={filters.customLocation}
                onChange={(e) => handleInputChange("customLocation", e.target.value)}
                placeholder="e.g. Mumbai, Gurgaon"
              />
            </Grid>
          )}

          {/* Joining Timeline */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Joining Availability"
              size="small"
              fullWidth
              value={filters.joining}
              onChange={(e) => handleInputChange("joining", e.target.value)}
            >
              <MenuItem value="Any">Any Timeline</MenuItem>
              <MenuItem value="Immediate">Immediate Joining</MenuItem>
              <MenuItem value="Within 1 Month">Within 1 Month</MenuItem>
              <MenuItem value="Within 2 Months">Within 2 Months</MenuItem>
            </TextField>
          </Grid>

          {/* Company Radio Selector */}
          <Grid item xs={12} md={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748b", mr: 1 }}>
                Companies:
              </Typography>
              <RadioGroup
                row
                value={filters.companyMode}
                onChange={(e) => handleInputChange("companyMode", e.target.value)}
              >
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography variant="body2">All</Typography>} />
                <FormControlLabel value="specific" control={<Radio size="small" />} label={<Typography variant="body2">Select Specific</Typography>} />
              </RadioGroup>
            </Stack>
          </Grid>

          {/* Search Button */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => fetchJobs()}
              disabled={loading}
              sx={{
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1d4ed8" },
                textTransform: "none",
                fontWeight: 600,
                py: 0.9
              }}
            >
              {loading ? "Searching..." : "Apply Filters"}
            </Button>
          </Grid>

          {/* Specific Companies Checkboxes */}
          {filters.companyMode === "specific" && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <FormGroup row sx={{ gap: 2, pt: 0.5 }}>
                {POPULAR_COMPANIES.map((company) => (
                  <FormControlLabel
                    key={company}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.selectedCompanies.includes(company)}
                        onChange={() => handleCompanyToggle(company)}
                      />
                    }
                    label={<Typography variant="body2">{company}</Typography>}
                  />
                ))}
              </FormGroup>
            </Grid>
          )}
        </Grid>
      </Paper>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Results List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : jobs.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: "center", bgcolor: "#ffffff", borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            No matching jobs found. Try adjusting your search filters above.
          </Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {jobs.map((job, idx) => (
            <Card
              key={job.job_id || idx}
              variant="outlined"
              sx={{
                p: 2.5,
                bgcolor: "#ffffff",
                borderRadius: 2,
                borderColor: "#e2e8f0",
                transition: "box-shadow 0.2s ease-in-out",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }
              }}
            >
              <CardContent sx={{ p: "0 !important" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#0f172a" }}>
                  {job.title}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={job.thumbnail}
                      alt={job.company_name}
                      variant="rounded"
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "0.75rem",
                        bgcolor: "#e2e8f0",
                        color: "#475569",
                        border: "1px solid #cbd5e1"
                      }}
                    >
                      {job.company_name ? job.company_name.charAt(0) : <BusinessOutlinedIcon fontSize="small" />}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                      {job.company_name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", color: "#64748b" }}>
                    <LocationOnOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{job.location || "Location not specified"}</Typography>
                  </Box>

                  {job.detected_extensions?.schedule_type && (
                    <Box sx={{ display: "flex", alignItems: "center", color: "#64748b" }}>
                      <WorkOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{job.detected_extensions.schedule_type}</Typography>
                    </Box>
                  )}

                  {job.detected_extensions?.posted_at && (
                    <Box sx={{ display: "flex", alignItems: "center", color: "#64748b" }}>
                      <ScheduleOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{job.detected_extensions.posted_at}</Typography>
                    </Box>
                  )}
                </Stack>

                {job.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {job.description}
                  </Typography>
                )}

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1}>
                    {job.detected_extensions?.work_from_home && (
                      <Chip label="Remote" size="small" color="success" variant="outlined" />
                    )}
                    {job.detected_extensions?.salary && (
                      <Chip label={job.detected_extensions.salary} size="small" variant="outlined" />
                    )}
                  </Stack>

                  {job.apply_options?.[0]?.link && (
                    <Button
                      variant="contained"
                      size="small"
                      href={job.apply_options[0].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textTransform: "none", borderRadius: 1.5, px: 2 }}
                    >
                      Apply
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}